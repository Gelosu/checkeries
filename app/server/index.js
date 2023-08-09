const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connection = require('./db');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails
const moment = require('moment');



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'mySecretKey', resave: false, saveUninitialized: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser('mySecretKey'));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

// Check if the TUPCID already exists in the database for both students and faculty
const checkTUPCIDExists = async (TUPCID, table) => {
  try {
    const query = `SELECT TUPCID FROM ${table} WHERE TUPCID = ?`;
    const [rows] = await connection.query(query, [TUPCID]);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
};


//check login

// Helper function to check login credentials for both students and faculty
const checkLogin = async (table, TUPCID, PASSWORD, accountType) => {
  try {
    const query = `SELECT * FROM ${table}_accounts WHERE TUPCID = ?`;
    const [rows] = await connection.query(query, [TUPCID]);

    if (rows.length === 0) {
      return { accountType: null };
    }

    const user = rows[0];
    const isPasswordMatch = await bcryptjs.compare(PASSWORD, user.PASSWORD);

    if (isPasswordMatch) {
      return { accountType };
    } else {
      return { accountType: null };
    }
  } catch (error) {
    throw error;
  }
};


// FOR STUDENT REGISTRATION
app.post('/studreg', (req, res) => {
  const {
    TUPCID,
    SURNAME,
    FIRSTNAME,
    GSFEACC,
    COURSE,
    YEAR,
    STATUS,
    PASSWORD,
  } = req.body;

  // Check if the TUPCID already exists in the student_accounts table
  checkTUPCIDExists(TUPCID, 'student_accounts')
    .then((exists) => {
      if (exists) {
        return res.status(409).send({ message: 'TUPCID already exists. Student registration failed.' });
      }

      // TUPCID does not exist, proceed with student registration
      if (STATUS === 'REGULAR' || STATUS === 'IRREGULAR') {
        // Hash the password before storing it in the database
        bcryptjs.hash(PASSWORD, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Server error' });
          }

          const query = `INSERT INTO student_accounts (TUPCID, SURNAME, FIRSTNAME, GSFEACC, COURSE, YEAR, STATUS, PASSWORD) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          connection.query(
            query,
            [TUPCID, SURNAME, FIRSTNAME, GSFEACC, COURSE, YEAR, STATUS, hashedPassword], // Use hashedPassword here
            (err, result) => {
              if (err) {
                console.error('Error executing the INSERT query:', err);
                return res.status(500).send({ message: 'Database error' });
              }
              return res.status(200).send({ message: 'Student registered successfully' });
            }
          );
        });
      } else {
        return res.status(400).send({ message: 'Invalid STATUS value' });
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});

// FOR PROFESSOR REGISTRATION
app.post('/facultyreg', (req, res) => {
  const {
    TUPCID,
    SURNAME,
    FIRSTNAME,
    MIDDLENAME,
    GSFEACC,
    SUBJECTDEPT,
    PASSWORD,
  } = req.body;

  // Check if the TUPCID already exists in the faculty_accounts table
  checkTUPCIDExists(TUPCID, 'faculty_accounts')
    .then((exists) => {
      if (exists) {
        return res.status(409).send({ message: 'TUPCID already exists. Faculty registration failed.' });
      }

      // TUPCID does not exist, proceed with faculty registration
      bcryptjs.hash(PASSWORD, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).send({ message: 'Server error' });
        }

        const query = `INSERT INTO faculty_accounts (TUPCID, SURNAME, FIRSTNAME, MIDDLENAME, GSFEACC, SUBJECTDEPT, PASSWORD) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        connection.query(
          query,
          [TUPCID, SURNAME, FIRSTNAME, MIDDLENAME, GSFEACC, SUBJECTDEPT, hashedPassword],
          (err, result) => {
            if (err) {
              console.error('Error executing the INSERT query:', err);
              return res.status(500).send({ message: 'Database error' });
            }
            return res.status(200).send({ message: 'Faculty registered successfully' });
          }
        );
      });
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});

// DELETE STUDENT DATA
app.delete('/students/:TUPCID', (req, res) => {
  const { TUPCID } = req.params;
  const query = 'DELETE FROM student_accounts WHERE TUPCID = ?';
  connection.query(query, [TUPCID], (err, result) => {
    if (err) {
      console.error('Error deleting student data:', err);
      return res.status(500).send({ message: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Student not found' });
    }
    return res.status(200).send({ message: 'Student deleted successfully' });
  });
});

// DELETE FACULTY DATA
app.delete('/faculty/:TUPCID', (req, res) => {
  const { TUPCID } = req.params;
  const query = 'DELETE FROM faculty_accounts WHERE TUPCID = ?';
  connection.query(query, [TUPCID], (err, result) => {
    if (err) {
      console.error('Error deleting faculty data:', err);
      return res.status(500).send({ message: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Faculty not found' });
    }
    return res.status(200).send({ message: 'Faculty deleted successfully' });
  });
});

// DELETE ADMIN ACCOUNT
app.delete('/admin/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const query = 'DELETE FROM admin_accounts WHERE TUPCID = ?';
  connection.query(query, [TUPCID], (err, result) => {
    if (err) {
      console.error('Error deleting admin data:', err);
      return res.status(500).send({ message: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Admin not found' });
    }
    return res.status(200).send({ message: 'Admin deleted successfully' });
  });
});


// GET STUDENT DATA
app.get('/students', (req, res) => {
  const query = 'SELECT TUPCID, SURNAME, FIRSTNAME, GSFEACC, COURSE, YEAR, STATUS, PASSWORD FROM student_accounts';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching student data:', err);
      return res.status(500).send({ message: 'Database error' });
    }
    return res.status(200).send(result);
  });
});

// GET FACULTY DATA
app.get('/faculty', (req, res) => {
  const query = 'SELECT TUPCID, SURNAME, FIRSTNAME, MIDDLENAME, GSFEACC, SUBJECTDEPT, PASSWORD FROM faculty_accounts';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching faculty data:', err);
      return res.status(500).send({ message: 'Database error' });
    }
    return res.status(200).send(result);
  });
});

// GET ADMIN ACCOUNTS
app.get('/admin', (req, res) => {
  const query = 'SELECT TUPCID, ADMINNAME, EMAIL, PASSWORD FROM admin_accounts';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching admin accounts:', err);
      return res.status(500).send({ message: 'Database error' });
    }
    return res.status(200).send(result);
  });
});

// UPDATE STUDENT DATA
app.put('/student/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const updatedData = req.body;

  // Check if the TUPCID exists in the student_accounts table
  checkTUPCIDExists(TUPCID, 'student_accounts')
    .then((exists) => {
      if (!exists) {
        return res.status(404).send({ message: 'Student not found' });
      }

      // Hash the password before updating (if provided)
      if (updatedData.PASSWORD) {
        bcryptjs.hash(updatedData.PASSWORD, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Server error' });
          }

          // Remove the password from updatedData since we don't want to update it separately
          const { PASSWORD, ...dataToUpdate } = updatedData;

          const fieldsToUpdate = Object.keys(dataToUpdate)
            .map((key) => `${key} = ?`)
            .join(', ');

          const query = `UPDATE student_accounts
                         SET ${fieldsToUpdate}, PASSWORD = ?
                         WHERE TUPCID = ?`;

          connection.query(
            query,
            [...Object.values(dataToUpdate), hashedPassword, TUPCID],
            (err, result) => {
              if (err) {
                console.error('Error updating student data:', err);
                return res.status(500).send({ message: 'Database error' });
              }
              return res.status(200).send({ message: 'Student updated successfully' });
            }
          );
        });
      } else {
        // If the PASSWORD field is not being updated, send the data to the server without hashing
        const fieldsToUpdate = Object.keys(updatedData)
          .filter((key) => key !== 'TUPCID') // Exclude TUPCID from the fields to update
          .map((key) => `${key} = ?`)
          .join(', ');

        const query = `UPDATE student_accounts
                       SET ${fieldsToUpdate}
                       WHERE TUPCID = ?`;

        connection.query(
          query,
          [...Object.values(updatedData).filter((val) => val !== updatedData.PASSWORD), TUPCID],
          (err, result) => {
            if (err) {
              console.error('Error updating student data:', err);
              return res.status(500).send({ message: 'Database error' });
            }
            return res.status(200).send({ message: 'Student updated successfully' });
          }
        );
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});



// UPDATE FACULTY DATA
app.put('/faculty/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const updatedData = req.body;

  // Check if the TUPCID exists in the faculty_accounts table
  checkTUPCIDExists(TUPCID, 'faculty_accounts')
    .then((exists) => {
      if (!exists) {
        return res.status(404).send({ message: 'Faculty not found' });
      }

      // Hash the password before updating (if provided)
      if (updatedData.PASSWORD) {
        bcryptjs.hash(updatedData.PASSWORD, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Server error' });
          }

          // Remove the password from updatedData since we don't want to update it separately
          const { PASSWORD, ...dataToUpdate } = updatedData;

          const fieldsToUpdate = Object.keys(dataToUpdate)
            .map((key) => `${key} = ?`)
            .join(', ');

          const query = `UPDATE faculty_accounts
                         SET ${fieldsToUpdate}, PASSWORD = ?
                         WHERE TUPCID = ?`;

          connection.query(
            query,
            [...Object.values(dataToUpdate), hashedPassword, TUPCID],
            (err, result) => {
              if (err) {
                console.error('Error updating faculty data:', err);
                return res.status(500).send({ message: 'Database error' });
              }
              return res.status(200).send({ message: 'Faculty updated successfully' });
            }
          );
        });
      } else {
        // If the PASSWORD field is not being updated, send the data to the server without hashing
        const fieldsToUpdate = Object.keys(updatedData)
          .filter((key) => key !== 'TUPCID') // Exclude TUPCID from the fields to update
          .map((key) => `${key} = ?`)
          .join(', ');

        const query = `UPDATE faculty_accounts
                       SET ${fieldsToUpdate}
                       WHERE TUPCID = ?`;

        connection.query(
          query,
          [...Object.values(updatedData).filter((val) => val !== updatedData.PASSWORD), TUPCID],
          (err, result) => {
            if (err) {
              console.error('Error updating faculty data:', err);
              return res.status(500).send({ message: 'Database error' });
            }
            return res.status(200).send({ message: 'Faculty updated successfully' });
          }
        );
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});


// UPDATE ADMIN DATA
app.put('/admin/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const updatedData = req.body;

  // Check if the TUPCID exists in the admin_accounts table
  checkTUPCIDExists(TUPCID, 'admin_accounts')
    .then((exists) => {
      if (!exists) {
        return res.status(404).send({ message: 'Faculty not found' });
      }

      // Hash the password before updating (if provided)
      if (updatedData.PASSWORD) {
        bcryptjs.hash(updatedData.PASSWORD, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Server error' });
          }

          // Remove the password from updatedData since we don't want to update it separately
          const { PASSWORD, ...dataToUpdate } = updatedData;

          const fieldsToUpdate = Object.keys(dataToUpdate)
            .map((key) => `${key} = ?`)
            .join(', ');

          const query = `UPDATE admin_accounts
                         SET ${fieldsToUpdate}, PASSWORD = ?
                         WHERE TUPCID = ?`;

          connection.query(
            query,
            [...Object.values(dataToUpdate), hashedPassword, TUPCID],
            (err, result) => {
              if (err) {
                console.error('Error updating admin data:', err);
                return res.status(500).send({ message: 'Database error' });
              }
              return res.status(200).send({ message: 'admin updated successfully' });
            }
          );
        });
      } else {
        // If the PASSWORD field is not being updated, send the data to the server without hashing
        const fieldsToUpdate = Object.keys(updatedData)
          .filter((key) => key !== 'TUPCID') // Exclude TUPCID from the fields to update
          .map((key) => `${key} = ?`)
          .join(', ');

        const query = `UPDATE admin_accounts
                       SET ${fieldsToUpdate}
                       WHERE TUPCID = ?`;

        connection.query(
          query,
          [...Object.values(updatedData).filter((val) => val !== updatedData.PASSWORD), TUPCID],
          (err, result) => {
            if (err) {
              console.error('Error updating admin data:', err);
              return res.status(500).send({ message: 'Database error' });
            }
            return res.status(200).send({ message: 'admin updated successfully' });
          }
        );
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});


// Handle the login request
app.post('/login', async (req, res) => {
  const { TUPCID, PASSWORD } = req.body;

  try {
    const studentLoginResult = await checkLogin('student', TUPCID, PASSWORD, 'student');
    const facultyLoginResult = await checkLogin('faculty', TUPCID, PASSWORD, 'faculty');

    if (studentLoginResult.accountType === 'student') {
      res.json({ accountType: 'student' });
    } else if (facultyLoginResult.accountType === 'faculty') {
      res.json({ accountType: 'faculty' });
    } else {
      res.status(404).json({ message: 'Account does not exist' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});


app.post('/adminlogin', async (req, res) => {
  const { adminName, passWord } = req.body;

  try {
    const connect = await connection.getConnection();
    const adminLogin = await connect.execute('SELECT * FROM admin_accounts WHERE ADMINNAME = ? AND PASSWORD = ?', [adminName, passWord]);
    connect.release();
    if (adminLogin.length === 0) {
      return res.status(404).send({ isAuthenticated: false });
    }
    return res.status(200).send({ isAuthenticated: true, adminName: adminLogin[0].ADMINNAME });
  } catch (err) {
    console.error('Error fetching admin account:', err);
    return res.status(500).send({ message: 'Database error' });
  }
});




//passwordreset



/// Function to send the email to GSFE Account
const sendEmailToGSFEAccount = async (GSFEACC, code) => {
  // Replace these placeholders with your actual email service credentials and settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eos2022to2023@gmail.com',
      pass: 'ujfshqykrtepqlau',
    },
  });

  const mailOptions = {
    from: 'eos2022to2023@gmail.com',
    to: GSFEACC,
    subject: 'Forgot Password Code',
    text: `Good day! In order to update your password in the current account, please use the following 6-digit code: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to GSFE Account:', GSFEACC);
  } catch (err) {
    console.error('Error sending email to GSFE Account:', err);
    throw err;
  }
};




app.post('/forgotpassword', async (req, res) => {
  const { TUPCID, GSFEACC } = req.body;

  // Helper function to find the account type based on the TUPCID
  const findAccountType = async (TUPCID) => {
    try {
      const studentQuery = 'SELECT TUPCID FROM student_accounts WHERE TUPCID = ?';
      const facultyQuery = 'SELECT TUPCID FROM faculty_accounts WHERE TUPCID = ?';

      const [studentRows] = await connection.query(studentQuery, [TUPCID]);
      const [facultyRows] = await connection.query(facultyQuery, [TUPCID]);

      if (studentRows.length > 0) {
        return 'student';
      } else if (facultyRows.length > 0) {
        return 'faculty';
      } else {
        return null; // Account type not found
      }
    } catch (error) {
      throw error;
    }
  };

  const generateAndSendCode = async (TUPCID, GSFEACC, accountType) => { // Add 'accountType' as a parameter
    try {
      // Generate a random 6-digit number between 100000 and 999999 (inclusive)
      const min = 100000;
      const max = 999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  
      // Convert the random number to a 6-digit string by padding with leading zeros
      const code = randomNumber.toString().padStart(6, '0');
  
      // Store the code and accountType in the database along with TUPCID and GSFEACC
      const query = 'INSERT INTO passwordreset_accounts (TUPCID, GSFEACC, code, accountType) VALUES (?, ?, ?, ?)'; // Include 'accountType' in the query
      await connection.query(query, [TUPCID, GSFEACC, code, accountType]); // Pass 'accountType' as a parameter
  
      // Send the code and account type to the registered GSFE account via email
      sendEmailToGSFEAccount(GSFEACC, code);
  
      // Send the response back to the client along with the account type
      return res.status(200).send({ message: 'Code sent to GSFE Account'});
    } catch (err) {
      console.error('Error generating and sending code:', err);
      return res.status(500).send({ message: 'Failed to generate and send code' });
    }
  };
 
  
  
  try {
    // Check if TUPCID and GSFEACC are provided and not empty
    if (!TUPCID || !GSFEACC) {
      return res.status(400).send({ message: 'TUPCID and GSFEACC are required fields' });
    }

    // Check if the TUPCID exists in any account type table (student_accounts or faculty_accounts)
    const accountType = await findAccountType(TUPCID);
    if (!accountType) {
      return res.status(404).send({ message: 'TUPCID does not exist' });
    }

    // Generate a random 6-digit number between 100000 and 999999 (inclusive)
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
    const code = randomNumber.toString().padStart(6, '0');

    // Store the code and accountType in the database along with TUPCID and GSFEACC
    const query = 'INSERT INTO passwordreset_accounts (TUPCID, GSFEACC, code, accountType) VALUES (?, ?, ?, ?)';
    await connection.query(query, [TUPCID, GSFEACC, code, accountType]);

    // Send the code to the GSFE account via email
    await sendEmailToGSFEAccount(GSFEACC, code);

    // Send the response back to the client along with the account type
    return res.status(200).send({
      message: 'A 6-digit code has been sent to the provided GSFE Account email address.',
      accountType,
    });
  } catch (err) {
    console.error('Error handling forgot password request:', err);
    return res.status(500).send({ message: 'Failed to process the request' });
  }
});

//match coding...
// POST request to check if the inputted code matches the code received on the user's email
// Check if the inputted code matches the code received on the user's email
app.post('/matchcode', async (req, res) => {
  const { TUPCID, code } = req.body;

  try {
    // Check if the TUPCID exists in the passwordreset_accounts table
    const query = 'SELECT * FROM passwordreset_accounts WHERE TUPCID = ?';
    const [rows] = await connection.query(query, [TUPCID]);

    // Check if there is a record for the provided TUPCID
    if (rows.length === 0) {
      return res.status(404).send({ message: 'TUPCID not found' });
    }

    // Check if the inputted code matches the code stored in the database
    if (rows[0].code !== code) {
      return res.status(400).send({ message: 'Invalid code' });
    }

    // If the code matches, remove the code from the database
    const deleteQuery = 'DELETE FROM passwordreset_accounts WHERE TUPCID = ?';
    await connection.query(deleteQuery, [TUPCID]);

    // If the code matches and is removed, send a success response
    return res.status(200).send({ message: 'Code matches' });
  } catch (err) {
    console.error('Error checking code in the database:', err);
    return res.status(500).send({ message: 'Database error' });
  }
});

//getTUPCID IN FORGETPASSS..

app.get('/getTUPCID', async (req, res) => {
  const { code } = req.query;

  try {
    const query = 'SELECT TUPCID, accountType FROM passwordreset_accounts WHERE code = ?';
    const [rows] = await connection.query(query, [code]);

    if (rows.length > 0) {
      const { TUPCID, accountType } = rows[0];
      return res.status(200).send({ TUPCID, accountType });
    } else {
      return res.status(404).send({ message: 'Code not found' });
    }
  } catch (error) {
    console.error('Error fetching TUPCID:', error);
    return res.status(500).send({ message: 'Failed to fetch TUPCID' });
  }
});



//get account type
// Endpoint for fetching the account type based on TUPCID
app.get('/getaccounttype', async (req, res) => {
  const { TUPCID } = req.query;

  try {
    const accountType = await findAccountType(TUPCID);
    if (!accountType) {
      return res.status(404).send({ message: 'Account type not found for the provided TUPCID' });
    }
    return res.status(200).send({ accountType });
  } catch (err) {
    console.error('Error fetching account type:', err);
    return res.status(500).send({ message: 'Failed to fetch account type' });
  }
});


//update pass in forgot pass


// Helper function to update password for students and faculty
const updatePassword = async (table, TUPCID, PASSWORD) => {
  try {
    // Hash the new password before storing it in the database
    const hashedPassword = await bcryptjs.hash(PASSWORD, 10);

    const query = `UPDATE ${table}_accounts SET PASSWORD = ? WHERE TUPCID = ?`;
    await connection.query(query, [hashedPassword, TUPCID]);

    return { message: `${table} password updated successfully` };
  } catch (error) {
    throw error;
  }
};


app.put('/updatepassword/:TUPCID', async (req, res) => {
  const TUPCIDFromParams = req.params.TUPCID; // Get the TUPCID from the request params
  const { PASSWORD } = req.body;

  try {
    // Check if the TUPCID exists in either student_accounts or faculty_accounts table
    const accountType = await findAccountType(TUPCIDFromParams);
    if (accountType === 'student') {
      await updatePassword('student', TUPCIDFromParams, PASSWORD);
    } else if (accountType === 'faculty') {
      await updatePassword('faculty', TUPCIDFromParams, PASSWORD);
    } else {
      return res.status(404).send({ message: 'TUPCID not found' });
    }

    return res.status(200).send({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    return res.status(500).send({ message: 'Failed to update password' });
  }
});

//FIND ACCOUNT TYPE
const findAccountType = async (TUPCID) => {
  try {
    // Query the student_accounts table
    const [studentRows] = await connection.query("SELECT TUPCID FROM student_accounts WHERE TUPCID = ?", [TUPCID]);

    if (studentRows.length > 0) {
      return "student";
    }

    // Query the faculty_accounts table
    const [facultyRows] = await connection.query("SELECT TUPCID FROM faculty_accounts WHERE TUPCID = ?", [TUPCID]);

    if (facultyRows.length > 0) {
      return "faculty";
    }

    // If no match is found in both tables, return null
    return null;
  } catch (error) {
    console.error("Error finding account type:", error);
    throw error;
  }
};


//getting account type
app.get('/getAccountType/:TUPCID', async (req, res) => {
  const { TUPCID } = req.params;
  try {
    const accountType = await findAccountType(TUPCID); // Implement the findAccountType function
    return res.status(200).send({ accountType });
  } catch (err) {
    console.error('Error finding account type:', err);
    return res.status(500).send({ message: 'Failed to fetch account type' });
  }
});

//student info
app.get('/studinfo/:TUPCID', async (req, res) => {
  const { TUPCID } = req.params;

  try {
    const query ='SELECT FIRSTNAME, SURNAME, COURSE, YEAR FROM student_accounts WHERE TUPCID = ?';
    const [all] = await connection.query(query, [TUPCID]);

    if (all.length > 0) {  
      const { FIRSTNAME, SURNAME, COURSE, YEAR } = all[0];
      console.log(FIRSTNAME, SURNAME, COURSE, YEAR)
      return res.status(202).send({FIRSTNAME, SURNAME, COURSE, YEAR});
    } else {
      return res.status(404).send({ message: 'Code not found' });
    }
  } catch (error) {
    console.error('Error fetching TUPCID:', error);
    return res.status(500).send({ message: 'Failed to fetch TUPCID' });
  }
});



//faculty info

app.get('/facultyinfo/:TUPCID', async (req, res) => {
  const { TUPCID } = req.params;

  try {
    const query ='SELECT FIRSTNAME, SURNAME, SUBJECTDEPT FROM faculty_accounts WHERE TUPCID = ?';
    const [all] = await connection.query(query, [TUPCID]);

    if (all.length > 0) {  
      const { FIRSTNAME, SURNAME, SUBJECTDEPT } = all[0];
      console.log(FIRSTNAME, SURNAME, SUBJECTDEPT)
      return res.status(202).send({FIRSTNAME, SURNAME, SUBJECTDEPT});
    } else {
      return res.status(404).send({ message: 'Code not found' });
    }
  } catch (error) {
    console.error('Error fetching TUPCID:', error);
    return res.status(500).send({ message: 'Failed to fetch TUPCID' });
  }
});


//faculty add and delete class

// Endpoint to add a new class
app.post('/addclass', (req, res) => {
  const { account_id, class_code, class_name, subject_name } = req.body;

  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss'); // Format the created_at value

  const query = `INSERT INTO class_table (account_id, class_code, class_name, subject_name, created_at) VALUES (?, ?, ?, ?, ?)`;
  connection.query(query, [account_id, class_code, class_name, subject_name, createdAt], (error, results) => {
    if (error) {
      console.error('Error adding class: ', error);
      res.status(500).send('Error adding class');
    } else {
      console.log('Class added successfully');
      res.status(201).send('Class added successfully');
    }
  });
});

// Endpoint to delete a class by classCode
app.delete("/deleteclass/:class_name", (req, res) => {
  const class_name = req.params.class_name;
  

  const query = 'DELETE FROM class_table WHERE class_name = ? ';
  connection.query(query, [class_name], (error, results) => {
    if (error) {
      console.error("Error deleting class: ", error);
      res.status(500).send("Error deleting class");
    } else if (results.affectedRows === 0) {
      res.status(404).send("Class not found");
    } else {
      console.log("Class deleted successfully");
      res.status(200).send("Class deleted successfully");
    }
  });
});

//not working
app.get("/classes", (req, res) => {
  const account_id = req.query.account_id;
 const query = "SELECT * FROM class_table WHERE account_id=?";
  console.log('accountid:', account_id);
  connection.query(query, [account_id], (error, results) => {
   if (error) {
      console.error("Error fetching classes: ", error);
     res.status(500).send("Error fetching classes");
  } else {
      console.log("Classes fetched successfully");
      res.status(200).json(results);
   }
 });
});


//working but not relying on id
//app.get("/classes", (req, res) => {
  ///const query = "SELECT * FROM class_table";
  
  //connection.query(query, (error, results) => {
   //if (error) {
   //   console.error("Error fetching classes: ", error);
   //  res.status(500).send("Error fetching classes");
   //} else {
    // console.log("Classes fetched successfully");
   //  res.status(200).json(results);
  // }
 // });
//});

//for server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
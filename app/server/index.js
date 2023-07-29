const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connection = require('./db');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails



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


app.post('/adminlogin', (req, res) => {
  const { adminName } = req.body;

  // Check if the adminName exists in the admin_accounts table
  const query = 'SELECT * FROM admin_accounts WHERE ADMINNAME = ?';
  connection.query(query, [adminName], (err, result) => {
    if (err) {
      console.error('Error fetching admin account:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    if (result.length === 0) {
      // AdminName not found in the database
      return res.status(404).send({ isAuthenticated: false });
    }

    // AdminName found, admin is authenticated
    // In a production scenario, you may want to generate a secure token here and use it to authenticate the user
    return res.status(200).send({ isAuthenticated: true, adminName: result[0].ADMINNAME });
  });
});



//passwordreset



// Send email to GSFE Account
const sendEmailToGSFEAccount = (GSFEACC, code) => {
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

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};




// FORGOT PASSWORD
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

  const generateAndSendCode = async (TUPCID, GSFEACC) => {
    try {
      // Generate a random 6-digit number between 100000 and 999999 (inclusive)
      const min = 100000;
      const max = 999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  
      // Convert the random number to a 6-digit string by padding with leading zeros
      const code = randomNumber.toString().padStart(6, '0');
  
      // Store the code and accountType in the database along with TUPCID and GSFEACC
      const query = 'INSERT INTO passwordreset_accounts (TUPCID, GSFEACC, code) VALUES (?, ?, ?)';
      await connection.query(query, [TUPCID, GSFEACC, code]);
  
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

    // TUPCID exists, generate unique code, store it in the database, and send it to the GSFE account
    return await generateAndSendCode(TUPCID, GSFEACC, accountType); // Pass the accountType to the function
  } catch (err) {
    console.error('Error checking TUPCID in the database:', err);
    return res.status(500).send({ message: 'Failed to check TUPCID in the database' });
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
    const query = 'SELECT TUPCID FROM passwordreset_accounts WHERE code = ?';
    const [rows] = await connection.query(query, [code]);

    if (rows.length > 0) {
      return res.status(200).send({ TUPCID: rows[0].TUPCID});
    } else {
      return res.status(404).send({ message: 'Code not found' });
    }
  } catch (error) {
    console.error('Error fetching TUPCID:', error);
    return res.status(500).send({ message: 'Failed to fetch TUPCID' });
  }
});


//get account type
app.get('/getAccountType', async (req, res) => {
  const { TUPCID } = req.query;

  try {
    // Find the account type for the given TUPCID (student or faculty)
    const accountType = await findAccountType(TUPCID);

    if (accountType) {
      return res.status(200).send({ accountType });
    } else {
      return res.status(404).send({ message: 'Account type not found' });
    }
  } catch (err) {
    console.error('Error fetching account type:', err);
    return res.status(500).send({ message: 'Failed to fetch account type' });
  }
});


//update pass in forgot pass

// Helper function to update password for both students and faculty
const updatePassword = async (table, TUPCID, newPassword) => {
  try {
    // Hash the new password before storing it in the database
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const query = `UPDATE ${table}_accounts SET PASSWORD = ? WHERE TUPCID = ?`;
    await connection.query(query, [hashedPassword, TUPCID]);

    return { message: `${table} password updated successfully` };
  } catch (error) {
    throw error;
  }
};

// PASSWORD UPDATE
// PASSWORD UPDATE
app.put('/updatepassword/:TUPCID', async (req, res) => {
  const TUPCIDFromParams = req.params.TUPCID; // Get the TUPCID from the request params
  const { newPassword } = req.body;

  try {
    // Check if the TUPCID exists in the student_accounts table
    const existsInStudent = await checkTUPCIDExists(TUPCIDFromParams, 'student_accounts');
    if (existsInStudent) {
      await updatePassword('student_accounts', TUPCIDFromParams, newPassword);
      return res.status(200).send({ message: 'Password updated successfully' });
    }

    // Check if the TUPCID exists in the faculty_accounts table
    const existsInFaculty = await checkTUPCIDExists(TUPCIDFromParams, 'faculty_accounts');
    if (existsInFaculty) {
      await updatePassword('faculty_accounts', TUPCIDFromParams, newPassword);
      return res.status(200).send({ message: 'Password updated successfully' });
    }

    return res.status(404).send({ message: 'TUPCID not found' });
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



//for server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
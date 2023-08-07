import FacultyAside from './FacultyAside';

const withFacultyAside = (WrappedComponent) => {
  return (props) => (
    <div className="d-flex">
      <FacultyAside />
      <WrappedComponent {...props} />
    </div>
  );
};

export default withFacultyAside;
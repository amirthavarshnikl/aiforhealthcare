import React from 'react';

const DoctorNote = ({ note }) => {
  return (
    <div className="card">
      <div className="card-tag">DOCTOR'S NOTE</div>
      <div className="doctor-note-text">
        {note}
      </div>
    </div>
  );
};

export default DoctorNote;

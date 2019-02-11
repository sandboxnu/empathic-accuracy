import React from 'react';

const SERVER_URL = 'https://api.sandboxneu.com/empathic-accuracy';

function AdminPanel() {
  return (
    <div>
      <h1>Upload configuration file</h1>
      <form
        id="configForm"
        action={`${SERVER_URL}/experiment`}
        method="post"
        encType="multipart/form-data"
      >
        <input type="file" name="file" />
        <input type="submit" value="Upload!" />
      </form>
      <h1>Download collected data</h1>
      <a href={`${SERVER_URL}/data`} rel="noopener noreferrer" target="_blank">Download collected data</a>
    </div>
  );
}

export default AdminPanel;

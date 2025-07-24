import React, { useContext } from 'react';
import { ParentContext } from '../context/ParentContext';

const ChildPage = () => {
  const { parentMessage, sendToParent } = useContext(ParentContext);

  return (
    <div>
      <h2>This is Child Page</h2>
      <p>Received from parent: {parentMessage}</p>
      <button onClick={() => sendToParent("Hi Parent!")}>Send Message Back</button>
    </div>
  );
};

export default ChildPage;

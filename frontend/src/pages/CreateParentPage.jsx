import React, { useState } from 'react';


function CreateParent({ onSubmit }) {
  const [parentData, setParentData] = useState({
    ParentId: '',
    FamilyName: '',
    FirstName: '',
    Genre: '',
    Picture: '',
    DateofBirth: '',
    DateofDeath: '',
    Profession: '',
    Contacts: [],
    Info: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParentData({ ...parentData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(parentData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="ParentId" placeholder="ParentId" value={parentData.ParentId} onChange={handleChange} />
      <input type="text" name="FamilyName" placeholder="FamilyName" value={parentData.FamilyName} onChange={handleChange} />
      <input type="text" name="FirstName" placeholder="FirstName" value={parentData.FirstName} onChange={handleChange} />
      <input type="text" name="Genre" placeholder="Genre" value={parentData.Genre} onChange={handleChange} />
      {/* Ajoutez d'autres champs selon vos besoins */}
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateParent;

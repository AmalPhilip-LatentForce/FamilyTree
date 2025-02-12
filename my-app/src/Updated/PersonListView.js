// import React, { useState } from "react";
// import { ArrowLeft, Edit2, Plus } from "lucide-react";

// export const PersonListView = ({ persons, onUpdatePerson, onAddChild }) => {
//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedPerson, setEditedPerson] = useState(null);
//   const [isAddingChild, setIsAddingChild] = useState(false);
//   const [newChild, setNewChild] = useState(null);
//   const [addChildError, setAddChildError] = useState(null);

//   const handlePersonClick = (person) => {
//     setSelectedPerson(person);
//     setIsEditing(false);
//   };

//   const handleEdit = () => {
//     setEditedPerson({ ...selectedPerson });
//     setIsEditing(true);
//   };

//   const handleSave = () => {
//     onUpdatePerson(editedPerson);
//     setSelectedPerson(editedPerson);
//     setIsEditing(false);
//   };

//   const handleBack = () => {
//     if (isAddingChild) {
//       setIsAddingChild(false);
//       setNewChild(null);
//     } else if (isEditing) {
//       setIsEditing(false);
//     } else {
//       setSelectedPerson(null);
//     }
//   };

//   const handleAddChild = () => {
//     const newChildId = `I${Object.keys(persons).length + 1}`;

//     // Check if selected person has any unions
//     if (!selectedPerson.own_unions || selectedPerson.own_unions.length === 0) {
//       // Handle case where parent has no unions
//       alert("Selected person has no family unit. Please create a union first.");
//       return;
//     }

//     setNewChild({
//       id: newChildId,
//       name: "",
//       birthyear: null,
//       birthplace: "",
//       deathplace: "",
//       gender: "",
//       parent_union: selectedPerson.own_unions[0]
//     });
//     setIsAddingChild(true);
//   };
//   const canAddChildren = (person) => {
//     return person && person.own_unions && person.own_unions.length > 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedPerson(prev => ({
//       ...prev,
//       [name]: name === 'birthyear' ? (value ? parseInt(value) : null) : value
//     }));
//   };
//   if (isAddingChild && newChild) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center gap-4 mb-6">
//           <button
//             onClick={() => setIsAddingChild(false)}
//             className="text-gray-600 hover:text-gray-800"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <h2 className="text-xl font-semibold">Add New Child</h2>
//         </div>

//         <form className="space-y-4">
//           {addChildError && (
//             <div className="p-3 text-red-700 bg-red-50 rounded-md">
//               {addChildError}
//             </div>
//           )}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={newChild.name}
//               onChange={(e) => setNewChild({...newChild, name: e.target.value})}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Gender
//             </label>
//             <select
//               name="gender"
//               value={newChild.gender}
//               onChange={(e) => setNewChild({...newChild, gender: e.target.value})}
//               className="w-full p-2 border rounded-md"
//             >
//               <option value="">Select Gender</option>
//               <option value="M">Male</option>
//               <option value="F">Female</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Birth Year
//             </label>
//             <input
//               type="number"
//               name="birthyear"
//               value={newChild.birthyear || ''}
//               onChange={(e) => setNewChild({...newChild, birthyear: e.target.value ? parseInt(e.target.value) : null})}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Birth Place
//             </label>
//             <input
//               type="text"
//               name="birthplace"
//               value={newChild.birthplace}
//               onChange={(e) => setNewChild({...newChild, birthplace: e.target.value})}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//   <button
//     type="button"
//     onClick={() => {
//       try {
//         onAddChild(newChild, selectedPerson);
//         setIsAddingChild(false);
//         setAddChildError(null);
//       } catch (err) {
//         setAddChildError("Failed to add child. Please try again.");
//       }
//     }}
//     className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
//   >
//     Add Child
//   </button>
// </form>
//       </div>
//     );
//   }
//   if (isEditing && selectedPerson) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center gap-4 mb-6">
//           <button
//             onClick={handleBack}
//             className="text-gray-600 hover:text-gray-800"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <h2 className="text-xl font-semibold">Edit Person Details</h2>
//         </div>

//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={editedPerson.name}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//             <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Gender
//             </label>
//             <select
//                 name="gender"
//                 value={editedPerson.gender || ''}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md"
//             >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//             </select>
//             </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Birth Year
//             </label>
//             <input
//               type="number"
//               name="birthyear"
//               value={editedPerson.birthyear || ''}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Birth Place
//             </label>
//             <input
//               type="text"
//               name="birthplace"
//               value={editedPerson.birthplace}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Death Place
//             </label>
//             <input
//               type="text"
//               name="deathplace"
//               value={editedPerson.deathplace}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={handleSave}
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     );
//   }

//   if (selectedPerson) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center gap-4 mb-6">
//           <button
//             onClick={handleBack}
//             className="text-gray-600 hover:text-gray-800"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <h2 className="text-xl font-semibold">{selectedPerson.name}</h2>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <p className="text-sm text-gray-500">Gender</p>
//             <p className="text-lg">{selectedPerson.gender || 'Unknown'}</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Birth Year</p>
//             <p className="text-lg">{selectedPerson.birthyear || 'Unknown'}</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Birth Place</p>
//             <p className="text-lg">{selectedPerson.birthplace || 'Unknown'}</p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">Death Place</p>
//             <p className="text-lg">{selectedPerson.deathplace || 'Unknown'}</p>
//           </div>

//           <div className="flex gap-2">
//   <button
//     onClick={handleEdit}
//     className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
//   >
//     <Edit2 className="h-4 w-4" />
//     Edit Details
//   </button>
//   {canAddChildren(selectedPerson) && (
//     <button
//       onClick={handleAddChild}
//       className="flex items-center gap-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200"
//     >
//       <Plus className="h-4 w-4" />
//       Add Child
//     </button>
//   )}
// </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow">
//       <div className="p-4 border-b">
//         <h2 className="text-lg font-semibold">Family Members</h2>
//       </div>
//       <div className="divide-y max-h-[300px] overflow-y-auto">
//         {Object.values(persons).map((person) => (
//           <button
//             key={person.id}
//             onClick={() => handlePersonClick(person)}
//             className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
//           >
//             <div>
//               <p className="font-medium">{person.name}</p>
//               {person.birthyear && (
//                 <p className="text-sm text-gray-500">Born: {person.birthyear}</p>
//               )}
//             </div>

//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PersonListView;

// ******************************************************************* Add parent

import React, { useState } from "react";
import { ArrowLeft, Edit2, Plus, UserPlus } from "lucide-react";

export const PersonListView = ({
  persons,
  onUpdatePerson,
  onAddChild,
  onAddParents,
}) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPerson, setEditedPerson] = useState(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isAddingParents, setIsAddingParents] = useState(false);
  const [newChild, setNewChild] = useState(null);
  const [newParents, setNewParents] = useState(null);
  const [addChildError, setAddChildError] = useState(null);
  const [addParentsError, setAddParentsError] = useState(null);

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditedPerson({ ...selectedPerson });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdatePerson(editedPerson);
    setSelectedPerson(editedPerson);
    setIsEditing(false);
  };

  const handleBack = () => {
    if (isAddingChild) {
      setIsAddingChild(false);
      setNewChild(null);
    } else if (isEditing) {
      setIsEditing(false);
    } else {
      setSelectedPerson(null);
    }
  };

  const handleAddChild = () => {
    const newChildId = `I${Object.keys(persons).length + 1}`;

    // Check if selected person has any unions
    if (!selectedPerson.own_unions || selectedPerson.own_unions.length === 0) {
      // Handle case where parent has no unions
      alert("Selected person has no family unit. Please create a union first.");
      return;
    }

    setNewChild({
      id: newChildId,
      name: "",
      birthyear: null,
      birthplace: "",
      deathplace: "",
      gender: "",
      parent_union: selectedPerson.own_unions[0],
    });
    setIsAddingChild(true);
  };
  const canAddChildren = (person) => {
    return person && person.own_unions && person.own_unions.length > 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPerson((prev) => ({
      ...prev,
      [name]: name === "birthyear" ? (value ? parseInt(value) : null) : value,
    }));
  };
  if (isAddingChild && newChild) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setIsAddingChild(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Add New Child</h2>
        </div>

        <form className="space-y-4">
          {addChildError && (
            <div className="p-3 text-red-700 bg-red-50 rounded-md">
              {addChildError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newChild.name}
              onChange={(e) =>
                setNewChild({ ...newChild, name: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={newChild.gender}
              onChange={(e) =>
                setNewChild({ ...newChild, gender: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Year
            </label>
            <input
              type="number"
              name="birthyear"
              value={newChild.birthyear || ""}
              onChange={(e) =>
                setNewChild({
                  ...newChild,
                  birthyear: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Place
            </label>
            <input
              type="text"
              name="birthplace"
              value={newChild.birthplace}
              onChange={(e) =>
                setNewChild({ ...newChild, birthplace: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              try {
                onAddChild(newChild, selectedPerson);
                setIsAddingChild(false);
                setAddChildError(null);
              } catch (err) {
                setAddChildError("Failed to add child. Please try again.");
              }
            }}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add Child
          </button>
        </form>
      </div>
    );
  }
  if (isEditing && selectedPerson) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Edit Person Details</h2>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={editedPerson.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={editedPerson.gender || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Year
            </label>
            <input
              type="number"
              name="birthyear"
              value={editedPerson.birthyear || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Place
            </label>
            <input
              type="text"
              name="birthplace"
              value={editedPerson.birthplace}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Death Place
            </label>
            <input
              type="text"
              name="deathplace"
              value={editedPerson.deathplace}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    );
  }

  const handleAddParents = () => {
    const nextId = Object.keys(persons).length + 1;
    setNewParents({
      father: {
        id: `I${nextId}`,
        name: "",
        birthyear: null,
        birthplace: "",
        deathplace: "",
        gender: "M",
        own_unions: [],
      },
      mother: {
        id: `I${nextId + 1}`,
        name: "",
        birthyear: null,
        birthplace: "",
        deathplace: "",
        gender: "F",
        own_unions: [],
      },
    });
    setIsAddingParents(true);
  };

  const canAddParents = (person) => {
    return person && (!person.parent_union || person.parent_union === "");
  };

  if (isAddingParents && newParents) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              setIsAddingParents(false);
              setNewParents(null);
              setAddParentsError(null);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Add Parents</h2>
        </div>

        <form className="space-y-6">
          {addParentsError && (
            <div className="p-3 text-red-700 bg-red-50 rounded-md">
              {addParentsError}
            </div>
          )}

          {/* Father's Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-4">
              Father's Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newParents.father.name}
                  onChange={(e) =>
                    setNewParents({
                      ...newParents,
                      father: { ...newParents.father, name: e.target.value },
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Year
                </label>
                <input
                  type="number"
                  value={newParents.father.birthyear || ""}
                  onChange={(e) =>
                    setNewParents({
                      ...newParents,
                      father: {
                        ...newParents.father,
                        birthyear: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      },
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Place
                </label>
                <input
                  type="text"
                  value={newParents.father.birthplace}
                  onChange={(e) =>
                    setNewParents({
                      ...newParents,
                      father: {
                        ...newParents.father,
                        birthplace: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Mother's Information */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <h3 className="font-medium text-pink-800 mb-4">
              Mother's Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newParents.mother.name}
                  onChange={(e) =>
                    setNewParents({
                      ...newParents,
                      mother: { ...newParents.mother, name: e.target.value },
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Year
                </label>
                <input
                  type="number"
                  value={newParents.mother.birthyear || ""}
                  onChange={(e) =>
                    setNewParents({
                      ...newParents,
                      mother: {
                        ...newParents.mother,
                        birthyear: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      },
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Place
                </label>
                <input
                  type="text"
                  value={newParents.mother.birthplace}
                  onChange={(e) =>
                    setNewParents({
                      ...newParents,
                      mother: {
                        ...newParents.mother,
                        birthplace: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              try {
                onAddParents(newParents, selectedPerson);
                setIsAddingParents(false);
                setAddParentsError(null);
              } catch (err) {
                setAddParentsError("Failed to add parents. Please try again.");
              }
            }}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add Both Parents
          </button>
        </form>
      </div>
    );
  }
  if (selectedPerson) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">{selectedPerson.name}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-lg">{selectedPerson.gender || "Unknown"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Birth Year</p>
            <p className="text-lg">{selectedPerson.birthyear || "Unknown"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Birth Place</p>
            <p className="text-lg">{selectedPerson.birthplace || "Unknown"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Death Place</p>
            <p className="text-lg">{selectedPerson.deathplace || "Unknown"}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
            >
              <Edit2 className="h-4 w-4" />
              Edit Details
            </button>
            {canAddChildren(selectedPerson) && (
              <button
                onClick={handleAddChild}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200"
              >
                <Plus className="h-4 w-4" />
                Add Child
              </button>
            )}
            {canAddParents(selectedPerson) && (
              <button
                onClick={handleAddParents}
                className="flex items-center gap-2 bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200"
              >
                <UserPlus className="h-4 w-4" />
                Add Parents
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Family Members</h2>
      </div>
      <div className="divide-y max-h-[300px] overflow-y-auto">
        {Object.values(persons).map((person) => (
          <button
            key={person.id}
            onClick={() => handlePersonClick(person)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{person.name}</p>
              {person.birthyear && (
                <p className="text-sm text-gray-500">
                  Born: {person.birthyear}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonListView;

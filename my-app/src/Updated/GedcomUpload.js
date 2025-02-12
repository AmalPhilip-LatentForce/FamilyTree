// import React, { useState } from "react";
// import { Upload, FileText, ArrowRight } from "lucide-react";
// import { PersonListView } from "./PersonListView";  // Updated import

// const updateGedcomContent = (content, updatedPerson) => {
//   const lines = content.split('\n');
//   let inPersonBlock = false;
//   let currentPerson = null;

//   return lines.map(line => {
//     if (!line.trim()) return line;

//     const [level, ...rest] = line.trim().split(" ");
//     const levelNum = parseInt(level);

//     // Check for person block start
//     if (levelNum === 0 && rest[1] === "INDI") {
//       currentPerson = rest[0].replace(/@/g, "");
//       inPersonBlock = currentPerson === updatedPerson.id;
//     }
//     // End of person block
//     else if (levelNum === 0) {
//       inPersonBlock = false;
//     }

//     // Update values within person block
//     if (inPersonBlock) {
//       const tag = rest[0];
//       switch (tag) {
//         case "NAME":
//           return `${level} NAME ${updatedPerson.name}`;
//         case "SEX":
//           return `${level} SEX ${updatedPerson.gender}`;
//         case "DATE":
//           if (line.includes("BIRT")) {
//             return `${level} DATE ${updatedPerson.birthyear}`;
//           }
//           return line;
//         case "PLAC":
//           if (line.toLowerCase().includes("birt")) {
//             return `${level} PLAC ${updatedPerson.birthplace}`;
//           } else if (line.toLowerCase().includes("deat")) {
//             return `${level} PLAC ${updatedPerson.deathplace}`;
//           }
//           return line;
//       }
//     }
//     return line;
//   }).join('\n');
// };

// const GedcomUpload = ({ onDataParsed }) => {
//   const [gedcomContent, setGedcomContent] = useState("");
//   const [isFileUploaded, setIsFileUploaded] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const [error, setError] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [parsedData, setParsedData] = useState(null);

//   const parseGEDCOM = (content) => {
//     const lines = content.split("\n");
//     const persons = {};
//     const unions = {};
//     const links = [];
//     let currentEntity = null;
//     let currentType = null;
//     let currentSubTag = null;

//     // First pass: Collect basic information
//     lines.forEach((line) => {
//       if (!line.trim()) return;

//       const [level, ...rest] = line.trim().split(" ");
//       const levelNum = parseInt(level);

//       if (levelNum === 0) {
//         const id = rest[0];
//         const type = rest[1];

//         if (type === "INDI") {
//           currentType = "INDI";
//           currentEntity = id.replace(/@/g, "");
//           persons[currentEntity] = {
//             id: currentEntity,
//             name: "Unknown",
//             birthyear: null,
//             own_unions: [],
//             birthplace: "",
//             deathplace: "",
//             gender: "",
//             parent_union: null, // Ensure parent_union is initialized
//           };
//         } else if (type === "FAM") {
//           currentType = "FAM";
//           currentEntity = id.replace(/@/g, "");
//           unions[currentEntity] = {
//             id: currentEntity,
//             partner: [],
//             children: [],
//           };
//         } else {
//           currentType = null;
//           currentEntity = null;
//         }
//       } else if (currentEntity) {
//         const tag = rest[0];
//         const value = rest.slice(1).join(" ");

//         if (currentType === "INDI") {
//           switch (tag) {
//             case "NAME":
//               persons[currentEntity].name =
//                 value.replace(/\//g, "").trim() || "Unknown";
//               break;
//             case "BIRT":
//               currentSubTag = "BIRT";
//               break;
//             case "DATE":
//               if (currentSubTag === "BIRT") {
//                 const yearMatch = value.match(/\d{4}/);
//                 persons[currentEntity].birthyear = yearMatch
//                   ? parseInt(yearMatch[0])
//                   : null;
//               }
//               break;
//             case "PLAC":
//               if (currentSubTag === "BIRT") {
//                 persons[currentEntity].birthplace = value.trim();
//               }
//               break;
//             case "DEAT":
//               currentSubTag = "DEAT";
//               break;
//             case "PLAC":
//               if (currentSubTag === "DEAT") {
//                 persons[currentEntity].deathplace = value.trim();
//               }
//               break;
//             case "SEX":
//               persons[currentEntity].gender = value.trim();
//               break;
//             case "FAMC":
//               // Store parent union for child
//               persons[currentEntity].parent_union = value.replace(/@/g, "");
//               break;
//             default:
//               break;
//           }
//         } else if (currentType === "FAM") {
//           switch (tag) {
//             case "HUSB":
//               const husbId = value.replace(/@/g, "");
//               unions[currentEntity].partner.push(husbId);
//               if (persons[husbId]) {
//                 persons[husbId].own_unions = persons[husbId].own_unions || [];
//                 persons[husbId].own_unions.push(currentEntity);
//               }
//               links.push([husbId, currentEntity]);
//               break;
//             case "WIFE":
//               const wifeId = value.replace(/@/g, "");
//               unions[currentEntity].partner.push(wifeId);
//               if (persons[wifeId]) {
//                 persons[wifeId].own_unions = persons[wifeId].own_unions || [];
//                 persons[wifeId].own_unions.push(currentEntity);
//               }
//               links.push([wifeId, currentEntity]);
//               break;
//             case "CHIL":
//               const childId = value.replace(/@/g, "");
//               unions[currentEntity].children.push(childId);
//               if (persons[childId]) {
//                 persons[childId].parent_union = currentEntity;
//               }
//               links.push([currentEntity, childId]);
//               break;
//             default:
//               break;
//           }
//         }
//       }
//     });

//     // Function to sort persons by generations
//     const sortPersonsByGenerations = (persons, unions) => {
//       const getGeneration = (personId, cache = new Map()) => {
//         if (cache.has(personId)) return cache.get(personId);

//         const person = persons[personId];
//         if (!person.parent_union) {
//           cache.set(personId, 0);
//           return 0;
//         }

//         const union = unions[person.parent_union];
//         if (!union || !union.partner.length) {
//           cache.set(personId, 0);
//           return 0;
//         }

//         const parentGen = Math.max(
//           ...union.partner.map(parentId => getGeneration(parentId, cache))
//         );
//         const generation = parentGen + 1;
//         cache.set(personId, generation);
//         return generation;
//       };

//       // Sort persons by generation and then by ID within same generation
//       const sortedPersons = {};
//       Object.keys(persons)
//         .sort((a, b) => {
//           const genA = getGeneration(a);
//           const genB = getGeneration(b);
//           if (genA !== genB) return genA - genB;

//           // If same generation, maintain original order by ID
//           const personA = persons[a];
//           const personB = persons[b];

//           // Sort by parent union first if in same generation
//           if (personA.parent_union !== personB.parent_union) {
//             return (personA.parent_union || "").localeCompare(personB.parent_union || "");
//           }

//           return a.localeCompare(b);
//         })
//         .forEach(id => {
//           sortedPersons[id] = persons[id];
//         });

//       return sortedPersons;
//     };

//     // Find the start person (earliest generation)
//     const findStartPerson = (persons) => {
//       return Object.values(persons).find(person => !person.parent_union)?.id || "I1";
//     };

//     // Sort persons by generation
//     const sortedPersons = sortPersonsByGenerations(persons, unions);
//     const start = findStartPerson(sortedPersons);

//     return { start, persons: sortedPersons, unions, links };
//   };

//   const sortFamilyMembers = (data) => {
//     const { persons, unions } = data;

//     // Helper function to get generation number
//     const getGeneration = (personId, cache = new Map()) => {
//       if (cache.has(personId)) return cache.get(personId);

//       const person = persons[personId];
//       if (!person || !person.parent_union) {
//         cache.set(personId, 0);
//         return 0;
//       }

//       const union = unions[person.parent_union];
//       if (!union || !union.partner.length) {
//         cache.set(personId, 0);
//         return 0;
//       }

//       const parentGen = Math.max(
//         ...union.partner.map(parentId => getGeneration(parentId, cache))
//       );
//       const gen = parentGen + 1;
//       cache.set(personId, gen);
//       return gen;
//     };

//     // Helper function to get sibling order
//     const getSiblingOrder = (personId) => {
//       const person = persons[personId];
//       if (!person || !person.parent_union) return 0;

//       const union = unions[person.parent_union];
//       if (!union) return 0;

//       return union.children.indexOf(personId);
//     };

//     // Sort persons by generation and sibling order
//     const sortedPersons = {};
//     Object.keys(persons)
//       .sort((a, b) => {
//         const genA = getGeneration(a);
//         const genB = getGeneration(b);

//         if (genA !== genB) return genA - genB;

//         // If same generation, sort by parent union
//         const personA = persons[a];
//         const personB = persons[b];

//         if (personA.parent_union !== personB.parent_union) {
//           return (personA.parent_union || '').localeCompare(personB.parent_union || '');
//         }

//         // If same parent union, sort by sibling order
//         return getSiblingOrder(a) - getSiblingOrder(b);
//       })
//       .forEach(id => {
//         sortedPersons[id] = persons[id];
//       });

//     return {
//       ...data,
//       persons: sortedPersons
//     };
//   };

//   const addChildToGedcom = (content, childData, parentUnionId) => {
//     const lines = content.split('\n');

//     // Create new individual entry
//     const individualEntry = [
//       `0 @${childData.id}@ INDI`,
//       `1 NAME ${childData.name}`,
//       `1 SEX ${childData.gender}`,
//       `1 BIRT`,
//       `2 DATE ${childData.birthyear}`,
//       `2 PLAC ${childData.birthplace}`,
//       `1 FAMC @${parentUnionId}@`
//     ];

//     // Find the appropriate insertion position
//     let insertIndex = -1;
//     let familySection = -1;
//     let inTargetFamily = false;
//     let lastChildIndex = -1;

//     // First, locate the target family and its last child
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();

//       // Mark the start of FAM records if we haven't found it yet
//       if (familySection === -1 && line.match(/^0.+FAM/)) {
//         familySection = i;
//       }

//       // Check if we're in our target family
//       if (line === `0 @${parentUnionId}@ FAM`) {
//         inTargetFamily = true;
//         continue;
//       }

//       // If we hit another 0-level record after our family, stop looking
//       if (inTargetFamily && line.startsWith('0 @') && !line.includes(parentUnionId)) {
//         break;
//       }

//       // While in our target family, track child references
//       if (inTargetFamily && line.startsWith('1 CHIL @')) {
//         const childRef = line.match(/@([^@]+)@/)[1];
//         // Find this child's INDI record
//         const childIndiIndex = lines.findIndex(l => l.includes(`@${childRef}@ INDI`));
//         if (childIndiIndex > lastChildIndex) {
//           lastChildIndex = childIndiIndex;
//         }
//       }
//     }

//     // Determine insertion position
//     if (lastChildIndex !== -1) {
//       // Insert after the last child's INDI record
//       insertIndex = lastChildIndex + 1;
//       while (insertIndex < lines.length && lines[insertIndex].trim().startsWith('1 ')) {
//         insertIndex++;
//       }
//     } else {
//       // If no existing children, insert before FAM records
//       insertIndex = familySection !== -1 ? familySection : lines.length;
//     }

//     // Insert the new INDI record
//     lines.splice(insertIndex, 0, ...individualEntry, '');

//     // Add child to family
//     const familyIndex = lines.findIndex(line => line.includes(`@${parentUnionId}@ FAM`));
//     if (familyIndex !== -1) {
//       // Find the position for the new CHIL tag
//       let childInsertIndex = familyIndex + 1;
//       // Skip other 1-level tags until we find CHIL or a different level
//       while (childInsertIndex < lines.length &&
//              lines[childInsertIndex].startsWith('1 ') &&
//              !lines[childInsertIndex].includes('CHIL')) {
//         childInsertIndex++;
//       }
//       // Find the last CHIL tag if any exist
//       while (childInsertIndex < lines.length &&
//              lines[childInsertIndex].startsWith('1 CHIL')) {
//         childInsertIndex++;
//       }

//       // Insert the new CHIL tag
//       lines.splice(childInsertIndex, 0, `1 CHIL @${childData.id}@`);
//     }

//     return lines.join('\n');
//   };

//   const handleAddChild = (childData, parentPerson) => {
//     // Validate parent has unions
//     if (!parentPerson || !parentPerson.own_unions || parentPerson.own_unions.length === 0) {
//       setError("Cannot add child: Parent has no family unit");
//       return;
//     }

//     // Get parent's union
//     const parentUnionId = parentPerson.own_unions[0];

//     try {
//       // Add parent union reference to child data
//       const enrichedChildData = {
//         ...childData,
//         parent_union: parentUnionId
//       };

//       // Update GEDCOM content
//       const updatedContent = addChildToGedcom(gedcomContent, enrichedChildData, parentUnionId);
//       setGedcomContent(updatedContent);

//       // Update the parsed data structure directly
//       const updatedData = {
//         ...parsedData,
//         persons: {
//           ...parsedData.persons,
//           [childData.id]: enrichedChildData
//         },
//         unions: {
//           ...parsedData.unions,
//           [parentUnionId]: {
//             ...parsedData.unions[parentUnionId],
//             children: [...parsedData.unions[parentUnionId].children, childData.id]
//           }
//         },
//         links: [
//           ...parsedData.links,
//           [parentUnionId, childData.id]
//         ]
//       };

//       // Update state and notify parent component
//       setParsedData(updatedData);
//       onDataParsed(updatedData);

//       setError(null);
//     } catch (err) {
//       setError("Error adding child to GEDCOM");
//       console.error("Error adding child:", err);
//     }
//   };
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setFileName(file.name);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const content = e.target.result;
//         setGedcomContent(content);
//         setIsFileUploaded(true);
//         setError(null);
//       };
//       reader.readAsText(file);
//     }
//   };

//   const handleGenerateTree = () => {
//     setIsGenerating(true);
//     try {
//       const parsedData = parseGEDCOM(gedcomContent);
//       const sortedData = sortFamilyMembers(parsedData);
//       setParsedData(sortedData);
//       onDataParsed(sortedData);
//       setError(null);
//     } catch (err) {
//       setError("Error parsing GEDCOM file");
//       console.error(err);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleUpdatePerson = (updatedPerson) => {
//     // Update the parsed data
//     const updatedData = {
//       ...parsedData,
//       persons: {
//         ...parsedData.persons,
//         [updatedPerson.id]: updatedPerson
//       }
//     };

//     // Update GEDCOM content
//     const updatedGedcomContent = updateGedcomContent(gedcomContent, updatedPerson);

//     // Update all states
//     setGedcomContent(updatedGedcomContent);
//     setParsedData(updatedData);
//     onDataParsed(updatedData);
//   };

//   const handleDownloadGedcom = () => {
//     const blob = new Blob([gedcomContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = fileName.replace('.ged', '_updated.ged');
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="mb-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         {!isFileUploaded ? (
//           <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
//             <label
//               htmlFor="gedcom-upload"
//               className="flex flex-col items-center gap-2 cursor-pointer"
//             >
//               <Upload className="h-12 w-12 text-gray-400" />
//               <span className="text-lg font-medium text-gray-600">
//                 Upload GEDCOM File
//               </span>
//               <span className="text-sm text-gray-500">
//                 Click to browse or drag and drop
//               </span>
//             </label>
//             <input
//               id="gedcom-upload"
//               type="file"
//               accept=".ged,.gedcom"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <FileText className="h-5 w-5 text-blue-500" />
//                 <span className="font-medium text-blue-700">{fileName}</span>
//               </div>
//               <label
//                 htmlFor="gedcom-upload"
//                 className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm font-medium"
//               >
//                 Change file
//               </label>
//             </div>

//             <div className="border rounded-lg bg-white shadow-sm">
//               <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
//                 <h2 className="font-medium text-gray-700">File Preview</h2>
//                 <span className="text-sm text-gray-500">
//                   {gedcomContent.split('\n').length} lines
//                 </span>
//               </div>
//               <div className="h-64 overflow-y-auto p-4 font-mono text-sm whitespace-pre text-gray-600">
//                 {gedcomContent.split('\n').map((line, index) => (
//                   <div key={index} className="flex">
//                     <span className="text-gray-400 w-12 select-none">{index + 1}</span>
//                     <span>{line}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {error && (
//               <div className="p-3 text-red-700 bg-red-50 rounded-md">{error}</div>
//             )}

//             <button
//               onClick={handleGenerateTree}
//               disabled={isGenerating || !gedcomContent}
//               className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
//             >
//               <span>
//                 {isGenerating ? "Generating Tree..." : "Generate Family Tree"}
//               </span>
//               <ArrowRight className="h-4 w-4" />
//             </button>
//                 {isFileUploaded && (
//                   <button
//                     onClick={handleDownloadGedcom}
//                     className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//                   >
//                     <span>Download Updated GEDCOM</span>
//                   </button>
//                 )}
//           </div>
//         )}
//       </div>
//       {parsedData && (
//         <div>
//           <PersonListView
//             persons={parsedData.persons}
//             onUpdatePerson={handleUpdatePerson}
//             onAddChild={handleAddChild}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default GedcomUpload;

// ********************************************************************* add parent

import React, { useState } from "react";
import { Upload, FileText, ArrowRight } from "lucide-react";
import { PersonListView } from "./PersonListView"; // Updated import

const updateGedcomContent = (content, updatedPerson) => {
  const lines = content.split("\n");
  let inPersonBlock = false;
  let currentPerson = null;

  return lines
    .map((line) => {
      if (!line.trim()) return line;

      const [level, ...rest] = line.trim().split(" ");
      const levelNum = parseInt(level);

      // Check for person block start
      if (levelNum === 0 && rest[1] === "INDI") {
        currentPerson = rest[0].replace(/@/g, "");
        inPersonBlock = currentPerson === updatedPerson.id;
      }
      // End of person block
      else if (levelNum === 0) {
        inPersonBlock = false;
      }

      // Update values within person block
      if (inPersonBlock) {
        const tag = rest[0];
        switch (tag) {
          case "NAME":
            return `${level} NAME ${updatedPerson.name}`;
          case "SEX":
            return `${level} SEX ${updatedPerson.gender}`;
          case "DATE":
            if (line.includes("BIRT")) {
              return `${level} DATE ${updatedPerson.birthyear}`;
            }
            return line;
          case "PLAC":
            if (line.toLowerCase().includes("birt")) {
              return `${level} PLAC ${updatedPerson.birthplace}`;
            } else if (line.toLowerCase().includes("deat")) {
              return `${level} PLAC ${updatedPerson.deathplace}`;
            }
            return line;
        }
      }
      return line;
    })
    .join("\n");
};

const GedcomUpload = ({ onDataParsed }) => {
  const [gedcomContent, setGedcomContent] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const parseGEDCOM = (content) => {
    const lines = content.split("\n");
    const persons = {};
    const unions = {};
    const links = [];
    let currentEntity = null;
    let currentType = null;
    let currentSubTag = null;

    // First pass: Collect basic information
    lines.forEach((line) => {
      if (!line.trim()) return;

      const [level, ...rest] = line.trim().split(" ");
      const levelNum = parseInt(level);

      if (levelNum === 0) {
        const id = rest[0];
        const type = rest[1];

        if (type === "INDI") {
          currentType = "INDI";
          currentEntity = id.replace(/@/g, "");
          persons[currentEntity] = {
            id: currentEntity,
            name: "Unknown",
            birthyear: null,
            own_unions: [],
            birthplace: "",
            deathplace: "",
            gender: "",
            parent_union: null, // Ensure parent_union is initialized
          };
        } else if (type === "FAM") {
          currentType = "FAM";
          currentEntity = id.replace(/@/g, "");
          unions[currentEntity] = {
            id: currentEntity,
            partner: [],
            children: [],
          };
        } else {
          currentType = null;
          currentEntity = null;
        }
      } else if (currentEntity) {
        const tag = rest[0];
        const value = rest.slice(1).join(" ");

        if (currentType === "INDI") {
          switch (tag) {
            case "NAME":
              persons[currentEntity].name =
                value.replace(/\//g, "").trim() || "Unknown";
              break;
            case "BIRT":
              currentSubTag = "BIRT";
              break;
            case "DATE":
              if (currentSubTag === "BIRT") {
                const yearMatch = value.match(/\d{4}/);
                persons[currentEntity].birthyear = yearMatch
                  ? parseInt(yearMatch[0])
                  : null;
              }
              break;
            case "PLAC":
              if (currentSubTag === "BIRT") {
                persons[currentEntity].birthplace = value.trim();
              }
              break;
            case "DEAT":
              currentSubTag = "DEAT";
              break;
            case "PLAC":
              if (currentSubTag === "DEAT") {
                persons[currentEntity].deathplace = value.trim();
              }
              break;
            case "SEX":
              persons[currentEntity].gender = value.trim();
              break;
            case "FAMC":
              // Store parent union for child
              persons[currentEntity].parent_union = value.replace(/@/g, "");
              break;
            default:
              break;
          }
        } else if (currentType === "FAM") {
          switch (tag) {
            case "HUSB":
              const husbId = value.replace(/@/g, "");
              unions[currentEntity].partner.push(husbId);
              if (persons[husbId]) {
                persons[husbId].own_unions = persons[husbId].own_unions || [];
                persons[husbId].own_unions.push(currentEntity);
              }
              links.push([husbId, currentEntity]);
              break;
            case "WIFE":
              const wifeId = value.replace(/@/g, "");
              unions[currentEntity].partner.push(wifeId);
              if (persons[wifeId]) {
                persons[wifeId].own_unions = persons[wifeId].own_unions || [];
                persons[wifeId].own_unions.push(currentEntity);
              }
              links.push([wifeId, currentEntity]);
              break;
            case "CHIL":
              const childId = value.replace(/@/g, "");
              unions[currentEntity].children.push(childId);
              if (persons[childId]) {
                persons[childId].parent_union = currentEntity;
              }
              links.push([currentEntity, childId]);
              break;
            default:
              break;
          }
        }
      }
    });

    // Function to sort persons by generations
    const sortPersonsByGenerations = (persons, unions) => {
      const getGeneration = (personId, cache = new Map()) => {
        if (cache.has(personId)) return cache.get(personId);

        const person = persons[personId];
        if (!person.parent_union) {
          cache.set(personId, 0);
          return 0;
        }

        const union = unions[person.parent_union];
        if (!union || !union.partner.length) {
          cache.set(personId, 0);
          return 0;
        }

        const parentGen = Math.max(
          ...union.partner.map((parentId) => getGeneration(parentId, cache))
        );
        const generation = parentGen + 1;
        cache.set(personId, generation);
        return generation;
      };

      // Sort persons by generation and then by ID within same generation
      const sortedPersons = {};
      Object.keys(persons)
        .sort((a, b) => {
          const genA = getGeneration(a);
          const genB = getGeneration(b);
          if (genA !== genB) return genA - genB;

          // If same generation, maintain original order by ID
          const personA = persons[a];
          const personB = persons[b];

          // Sort by parent union first if in same generation
          if (personA.parent_union !== personB.parent_union) {
            return (personA.parent_union || "").localeCompare(
              personB.parent_union || ""
            );
          }

          return a.localeCompare(b);
        })
        .forEach((id) => {
          sortedPersons[id] = persons[id];
        });

      return sortedPersons;
    };

    // Find the start person (earliest generation)
    const findStartPerson = (persons) => {
      return (
        Object.values(persons).find((person) => !person.parent_union)?.id ||
        "I1"
      );
    };

    // Sort persons by generation
    const sortedPersons = sortPersonsByGenerations(persons, unions);
    const start = findStartPerson(sortedPersons);

    return { start, persons: sortedPersons, unions, links };
  };

  const sortFamilyMembers = (data) => {
    const { persons, unions } = data;

    // Helper function to get generation number
    const getGeneration = (personId, cache = new Map()) => {
      if (cache.has(personId)) return cache.get(personId);

      const person = persons[personId];
      if (!person || !person.parent_union) {
        cache.set(personId, 0);
        return 0;
      }

      const union = unions[person.parent_union];
      if (!union || !union.partner.length) {
        cache.set(personId, 0);
        return 0;
      }

      const parentGen = Math.max(
        ...union.partner.map((parentId) => getGeneration(parentId, cache))
      );
      const gen = parentGen + 1;
      cache.set(personId, gen);
      return gen;
    };

    // Helper function to get sibling order
    const getSiblingOrder = (personId) => {
      const person = persons[personId];
      if (!person || !person.parent_union) return 0;

      const union = unions[person.parent_union];
      if (!union) return 0;

      return union.children.indexOf(personId);
    };

    // Sort persons by generation and sibling order
    const sortedPersons = {};
    Object.keys(persons)
      .sort((a, b) => {
        const genA = getGeneration(a);
        const genB = getGeneration(b);

        if (genA !== genB) return genA - genB;

        // If same generation, sort by parent union
        const personA = persons[a];
        const personB = persons[b];

        if (personA.parent_union !== personB.parent_union) {
          return (personA.parent_union || "").localeCompare(
            personB.parent_union || ""
          );
        }

        // If same parent union, sort by sibling order
        return getSiblingOrder(a) - getSiblingOrder(b);
      })
      .forEach((id) => {
        sortedPersons[id] = persons[id];
      });

    return {
      ...data,
      persons: sortedPersons,
    };
  };

  const addChildToGedcom = (content, childData, parentUnionId) => {
    const lines = content.split("\n");

    // Create new individual entry
    const individualEntry = [
      `0 @${childData.id}@ INDI`,
      `1 NAME ${childData.name}`,
      `1 SEX ${childData.gender}`,
      `1 BIRT`,
      `2 DATE ${childData.birthyear}`,
      `2 PLAC ${childData.birthplace}`,
      `1 FAMC @${parentUnionId}@`,
    ];

    // Find the appropriate insertion position
    let insertIndex = -1;
    let familySection = -1;
    let inTargetFamily = false;
    let lastChildIndex = -1;

    // First, locate the target family and its last child
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Mark the start of FAM records if we haven't found it yet
      if (familySection === -1 && line.match(/^0.+FAM/)) {
        familySection = i;
      }

      // Check if we're in our target family
      if (line === `0 @${parentUnionId}@ FAM`) {
        inTargetFamily = true;
        continue;
      }

      // If we hit another 0-level record after our family, stop looking
      if (
        inTargetFamily &&
        line.startsWith("0 @") &&
        !line.includes(parentUnionId)
      ) {
        break;
      }

      // While in our target family, track child references
      if (inTargetFamily && line.startsWith("1 CHIL @")) {
        const childRef = line.match(/@([^@]+)@/)[1];
        // Find this child's INDI record
        const childIndiIndex = lines.findIndex((l) =>
          l.includes(`@${childRef}@ INDI`)
        );
        if (childIndiIndex > lastChildIndex) {
          lastChildIndex = childIndiIndex;
        }
      }
    }

    // Determine insertion position
    if (lastChildIndex !== -1) {
      // Insert after the last child's INDI record
      insertIndex = lastChildIndex + 1;
      while (
        insertIndex < lines.length &&
        lines[insertIndex].trim().startsWith("1 ")
      ) {
        insertIndex++;
      }
    } else {
      // If no existing children, insert before FAM records
      insertIndex = familySection !== -1 ? familySection : lines.length;
    }

    // Insert the new INDI record
    lines.splice(insertIndex, 0, ...individualEntry, "");

    // Add child to family
    const familyIndex = lines.findIndex((line) =>
      line.includes(`@${parentUnionId}@ FAM`)
    );
    if (familyIndex !== -1) {
      // Find the position for the new CHIL tag
      let childInsertIndex = familyIndex + 1;
      // Skip other 1-level tags until we find CHIL or a different level
      while (
        childInsertIndex < lines.length &&
        lines[childInsertIndex].startsWith("1 ") &&
        !lines[childInsertIndex].includes("CHIL")
      ) {
        childInsertIndex++;
      }
      // Find the last CHIL tag if any exist
      while (
        childInsertIndex < lines.length &&
        lines[childInsertIndex].startsWith("1 CHIL")
      ) {
        childInsertIndex++;
      }

      // Insert the new CHIL tag
      lines.splice(childInsertIndex, 0, `1 CHIL @${childData.id}@`);
    }

    return lines.join("\n");
  };

  const handleAddChild = (childData, parentPerson) => {
    // Validate parent has unions
    if (
      !parentPerson ||
      !parentPerson.own_unions ||
      parentPerson.own_unions.length === 0
    ) {
      setError("Cannot add child: Parent has no family unit");
      return;
    }

    // Get parent's union
    const parentUnionId = parentPerson.own_unions[0];

    try {
      // Add parent union reference to child data
      const enrichedChildData = {
        ...childData,
        parent_union: parentUnionId,
      };

      // Update GEDCOM content
      const updatedContent = addChildToGedcom(
        gedcomContent,
        enrichedChildData,
        parentUnionId
      );
      setGedcomContent(updatedContent);

      // Update the parsed data structure directly
      const updatedData = {
        ...parsedData,
        persons: {
          ...parsedData.persons,
          [childData.id]: enrichedChildData,
        },
        unions: {
          ...parsedData.unions,
          [parentUnionId]: {
            ...parsedData.unions[parentUnionId],
            children: [
              ...parsedData.unions[parentUnionId].children,
              childData.id,
            ],
          },
        },
        links: [...parsedData.links, [parentUnionId, childData.id]],
      };

      // Update state and notify parent component
      setParsedData(updatedData);
      onDataParsed(updatedData);

      setError(null);
    } catch (err) {
      setError("Error adding child to GEDCOM");
      console.error("Error adding child:", err);
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setGedcomContent(content);
        setIsFileUploaded(true);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateTree = () => {
    setIsGenerating(true);
    try {
      const parsedData = parseGEDCOM(gedcomContent);
      const sortedData = sortFamilyMembers(parsedData);
      setParsedData(sortedData);
      onDataParsed(sortedData);
      setError(null);
    } catch (err) {
      setError("Error parsing GEDCOM file");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdatePerson = (updatedPerson) => {
    // Update the parsed data
    const updatedData = {
      ...parsedData,
      persons: {
        ...parsedData.persons,
        [updatedPerson.id]: updatedPerson,
      },
    };

    // Update GEDCOM content
    const updatedGedcomContent = updateGedcomContent(
      gedcomContent,
      updatedPerson
    );

    // Update all states
    setGedcomContent(updatedGedcomContent);
    setParsedData(updatedData);
    onDataParsed(updatedData);
  };

  const handleDownloadGedcom = () => {
    const blob = new Blob([gedcomContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(".ged", "_updated.ged");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addParentsToGedcom = (
    content,
    parentsData,
    childData,
    existingUnions
  ) => {
    const lines = content.split("\n");

    // Create new family unit ID
    const newFamId = `F${Object.keys(existingUnions).length + 1}`;

    // Create new individual entries for parents
    const fatherEntry = [
      `0 @${parentsData.father.id}@ INDI`,
      `1 NAME ${parentsData.father.name}`,
      `1 SEX M`,
      `1 BIRT`,
      `2 DATE ${parentsData.father.birthyear}`,
      `2 PLAC ${parentsData.father.birthplace}`,
      parentsData.father.deathplace
        ? `1 DEAT\n2 PLAC ${parentsData.father.deathplace}`
        : "",
      `1 FAMS @${newFamId}@`,
    ].filter((line) => line !== "");

    const motherEntry = [
      `0 @${parentsData.mother.id}@ INDI`,
      `1 NAME ${parentsData.mother.name}`,
      `1 SEX F`,
      `1 BIRT`,
      `2 DATE ${parentsData.mother.birthyear}`,
      `2 PLAC ${parentsData.mother.birthplace}`,
      parentsData.mother.deathplace
        ? `1 DEAT\n2 PLAC ${parentsData.mother.deathplace}`
        : "",
      `1 FAMS @${newFamId}@`,
    ].filter((line) => line !== "");

    // Create new family unit entry
    const familyEntry = [
      `0 @${newFamId}@ FAM`,
      `1 HUSB @${parentsData.father.id}@`,
      `1 WIFE @${parentsData.mother.id}@`,
      `1 CHIL @${childData.id}@`,
    ];

    // Find positions to insert new records
    const lastIndiIndex = lines.findLastIndex((line) =>
      line.match(/^0\s+@\w+@\s+INDI/)
    );
    const firstFamIndex = lines.findIndex((line) =>
      line.match(/^0\s+@\w+@\s+FAM/)
    );

    // Update child's record to include new family reference
    const childIndex = lines.findIndex((line) =>
      line.includes(`@${childData.id}@ INDI`)
    );
    if (childIndex !== -1) {
      // Find the end of the child's record
      let i = childIndex + 1;
      while (i < lines.length && !lines[i].startsWith("0")) {
        i++;
      }
      // Add FAMC reference if it doesn't exist
      if (!lines.slice(childIndex, i).some((line) => line.includes("FAMC"))) {
        lines.splice(i, 0, `1 FAMC @${newFamId}@`);
      }
    }

    // Insert new records
    if (firstFamIndex !== -1) {
      // Insert family entry before other FAM records
      lines.splice(firstFamIndex, 0, ...familyEntry, "");
      // Insert individual entries after last INDI record
      lines.splice(
        lastIndiIndex + 1,
        0,
        ...fatherEntry,
        "",
        ...motherEntry,
        ""
      );
    } else {
      // Add to end if no FAM records exist
      lines.push(...fatherEntry, "", ...motherEntry, "", ...familyEntry);
    }

    return lines.join("\n");
  };

  const handleAddParents = (parentsData, childPerson) => {
    try {
      // Update GEDCOM content
      const updatedContent = addParentsToGedcom(
        gedcomContent,
        parentsData,
        childPerson,
        parsedData.unions
      );
      setGedcomContent(updatedContent);

      // Create new family unit
      const newFamId = `F${Object.keys(parsedData.unions).length + 1}`;

      // Update data structures
      const updatedData = {
        ...parsedData,
        persons: {
          ...parsedData.persons,
          [parentsData.father.id]: {
            ...parentsData.father,
            own_unions: [newFamId],
          },
          [parentsData.mother.id]: {
            ...parentsData.mother,
            own_unions: [newFamId],
          },
          [childPerson.id]: {
            ...childPerson,
            parent_union: newFamId,
          },
        },
        unions: {
          ...parsedData.unions,
          [newFamId]: {
            id: newFamId,
            partner: [parentsData.father.id, parentsData.mother.id],
            children: [childPerson.id],
          },
        },
        links: [
          ...parsedData.links,
          [parentsData.father.id, newFamId],
          [parentsData.mother.id, newFamId],
          [newFamId, childPerson.id],
        ],
      };

      // Update state and notify parent component
      setParsedData(updatedData);
      onDataParsed(updatedData);
    } catch (err) {
      console.error("Error adding parents:", err);
      throw err;
    }
  };

  return (
    <div className="mb-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        {!isFileUploaded ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
            <label
              htmlFor="gedcom-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="h-12 w-12 text-gray-400" />
              <span className="text-lg font-medium text-gray-600">
                Upload GEDCOM File
              </span>
              <span className="text-sm text-gray-500">
                Click to browse or drag and drop
              </span>
            </label>
            <input
              id="gedcom-upload"
              type="file"
              accept=".ged,.gedcom"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-blue-700">{fileName}</span>
              </div>
              <label
                htmlFor="gedcom-upload"
                className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm font-medium"
              >
                Change file
              </label>
            </div>

            <div className="border rounded-lg bg-white shadow-sm">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-medium text-gray-700">File Preview</h2>
                <span className="text-sm text-gray-500">
                  {gedcomContent.split("\n").length} lines
                </span>
              </div>
              <div className="h-64 overflow-y-auto p-4 font-mono text-sm whitespace-pre text-gray-600">
                {gedcomContent.split("\n").map((line, index) => (
                  <div key={index} className="flex">
                    <span className="text-gray-400 w-12 select-none">
                      {index + 1}
                    </span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 text-red-700 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerateTree}
              disabled={isGenerating || !gedcomContent}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <span>
                {isGenerating ? "Generating Tree..." : "Generate Family Tree"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
            {isFileUploaded && (
              <button
                onClick={handleDownloadGedcom}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                <span>Download Updated GEDCOM</span>
              </button>
            )}
          </div>
        )}
      </div>
      {parsedData && (
        <div>
          <PersonListView
            persons={parsedData.persons}
            onUpdatePerson={handleUpdatePerson}
            onAddChild={handleAddChild}
            onAddParents={handleAddParents}
          />
        </div>
      )}
    </div>
  );
};

export default GedcomUpload;

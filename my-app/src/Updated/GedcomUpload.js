// // import React, { useState } from "react";
// // import { Upload, FileText, ArrowRight } from "lucide-react";

// // const GedcomUpload = ({ onDataParsed }) => {
// //   const [gedcomContent, setGedcomContent] = useState("");
// //   const [isFileUploaded, setIsFileUploaded] = useState(false);
// //   const [fileName, setFileName] = useState("");
// //   const [error, setError] = useState(null);

// //   const parseGEDCOM = (content) => {
// //     const lines = content.split("\n");
// //     const persons = {};
// //     const unions = {};
// //     const links = [];
// //     let currentEntity = null;
// //     let currentType = null;
// //     let currentSubTag = null;

// //     // First pass: Collect basic information
// //     lines.forEach((line) => {
// //       if (!line.trim()) return;

// //       const [level, ...rest] = line.trim().split(" ");
// //       const levelNum = parseInt(level);

// //       if (levelNum === 0) {
// //         const id = rest[0];
// //         const type = rest[1];

// //         if (type === "INDI") {
// //           currentType = "INDI";
// //           currentEntity = id.replace(/@/g, "");
// //           persons[currentEntity] = {
// //             id: currentEntity,
// //             name: "Unknown",
// //             birthyear: null,
// //             own_unions: [],
// //             birthplace: "",
// //             deathplace: "",
// //           };
// //         } else if (type === "FAM") {
// //           currentType = "FAM";
// //           currentEntity = id.replace(/@/g, "");
// //           unions[currentEntity] = {
// //             id: currentEntity,
// //             partner: [],
// //             children: [],
// //           };
// //         } else {
// //           currentType = null;
// //           currentEntity = null;
// //         }
// //       } else if (currentEntity) {
// //         const tag = rest[0];
// //         const value = rest.slice(1).join(" ");

// //         if (currentType === "INDI") {
// //           switch (tag) {
// //             case "NAME":
// //               persons[currentEntity].name =
// //                 value.replace(/\//g, "").trim() || "Unknown";
// //               break;
// //             case "BIRT":
// //               currentSubTag = "BIRT";
// //               break;
// //             case "DATE":
// //               if (currentSubTag === "BIRT") {
// //                 const yearMatch = value.match(/\d{4}/);
// //                 persons[currentEntity].birthyear = yearMatch
// //                   ? parseInt(yearMatch[0])
// //                   : null;
// //               }
// //               break;
// //             default:
// //               break;
// //           }
// //         } else if (currentType === "FAM") {
// //           switch (tag) {
// //             case "HUSB":
// //               const husbId = value.replace(/@/g, "");
// //               unions[currentEntity].partner.push(husbId);
// //               if (persons[husbId]) {
// //                 persons[husbId].own_unions = persons[husbId].own_unions || [];
// //                 persons[husbId].own_unions.push(currentEntity);
// //               }
// //               links.push([husbId, currentEntity]);
// //               break;
// //             case "WIFE":
// //               const wifeId = value.replace(/@/g, "");
// //               unions[currentEntity].partner.push(wifeId);
// //               if (persons[wifeId]) {
// //                 persons[wifeId].own_unions = persons[wifeId].own_unions || [];
// //                 persons[wifeId].own_unions.push(currentEntity);
// //               }
// //               links.push([wifeId, currentEntity]);
// //               break;
// //             case "CHIL":
// //               const childId = value.replace(/@/g, "");
// //               unions[currentEntity].children.push(childId);
// //               if (persons[childId]) {
// //                 persons[childId].parent_union = currentEntity;
// //               }
// //               links.push([currentEntity, childId]);
// //               break;
// //           }
// //         }
// //       }
// //     });

// //     // Find the starting person (person with ID "I1")
// //     const start = "I1";

// //     return {
// //       start,
// //       persons,
// //       unions,
// //       links,
// //     };
// //   };

// //   const handleFileUpload = (event) => {
// //     const file = event.target.files[0];
// //     if (file) {
// //       setFileName(file.name);
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         const content = e.target.result;
// //         setGedcomContent(content);
// //         setIsFileUploaded(true);
// //         try {
// //           const parsedData = parseGEDCOM(content);
// //           onDataParsed(parsedData);
// //           setError(null);
// //         } catch (err) {
// //           setError("Error parsing GEDCOM file");
// //         }
// //       };
// //       reader.readAsText(file);
// //     }
// //   };

// //   return (
// //     <div className="mb-6 max-w-2xl mx-auto">
// //       {!isFileUploaded ? (
// //         <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
// //           <label
// //             htmlFor="gedcom-upload"
// //             className="flex flex-col items-center gap-2 cursor-pointer"
// //           >
// //             <Upload className="h-12 w-12 text-gray-400" />
// //             <span className="text-lg font-medium text-gray-600">
// //               Upload GEDCOM File
// //             </span>
// //             <span className="text-sm text-gray-500">
// //               Click to browse or drag and drop
// //             </span>
// //           </label>
// //           <input
// //             id="gedcom-upload"
// //             type="file"
// //             accept=".ged,.gedcom"
// //             onChange={handleFileUpload}
// //             className="hidden"
// //           />
// //         </div>
// //       ) : (
// //         <div className="flex flex-col gap-4">
// //           <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
// //             <div className="flex items-center gap-3">
// //               <FileText className="h-5 w-5 text-blue-500" />
// //               <span className="font-medium text-blue-700">{fileName}</span>
// //             </div>
// //             <label
// //               htmlFor="gedcom-upload"
// //               className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm font-medium"
// //             >
// //               Change file
// //             </label>
// //           </div>

// //           <div className="border rounded-lg bg-white shadow-sm">
// //             <div className="p-4 border-b bg-gray-50">
// //               <h2 className="font-medium text-gray-700">File Preview</h2>
// //             </div>
// //             <div className="h-32 overflow-y-auto p-4 font-mono text-sm whitespace-pre text-gray-600">
// //               {gedcomContent}
// //             </div>
// //           </div>

// //           {error && (
// //             <div className="p-3 text-red-700 bg-red-50 rounded-md">{error}</div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default GedcomUpload;

// // ********************************************************************************

// import React, { useState } from "react";
// import { Upload, FileText, ArrowRight } from "lucide-react";

// const GedcomUpload = ({ onDataParsed }) => {
//   const [gedcomContent, setGedcomContent] = useState("");
//   const [isFileUploaded, setIsFileUploaded] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const [error, setError] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);

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
//           }
//         }
//       }
//     });

//     const start = "I1";
//     return { start, persons, unions, links };
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
//       onDataParsed(parsedData);
//       setError(null);
//     } catch (err) {
//       setError("Error parsing GEDCOM file");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <div className="mb-6 max-w-2xl mx-auto">
//       {!isFileUploaded ? (
//         <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
//           <label
//             htmlFor="gedcom-upload"
//             className="flex flex-col items-center gap-2 cursor-pointer"
//           >
//             <Upload className="h-12 w-12 text-gray-400" />
//             <span className="text-lg font-medium text-gray-600">
//               Upload GEDCOM File
//             </span>
//             <span className="text-sm text-gray-500">
//               Click to browse or drag and drop
//             </span>
//           </label>
//           <input
//             id="gedcom-upload"
//             type="file"
//             accept=".ged,.gedcom"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col gap-4">
//           <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
//             <div className="flex items-center gap-3">
//               <FileText className="h-5 w-5 text-blue-500" />
//               <span className="font-medium text-blue-700">{fileName}</span>
//             </div>
//             <label
//               htmlFor="gedcom-upload"
//               className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm font-medium"
//             >
//               Change file
//             </label>
//           </div>

//           <div className="border rounded-lg bg-white shadow-sm">
//             <div className="p-4 border-b bg-gray-50">
//               <h2 className="font-medium text-gray-700">File Preview</h2>
//             </div>
//             <div className="h-32 overflow-y-auto p-4 font-mono text-sm whitespace-pre text-gray-600">
//               {gedcomContent}
//             </div>
//           </div>

//           {error && (
//             <div className="p-3 text-red-700 bg-red-50 rounded-md">{error}</div>
//           )}

//           <button
//             onClick={handleGenerateTree}
//             disabled={isGenerating || !gedcomContent}
//             className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
//           >
//             <span>
//               {isGenerating ? "Generating Tree..." : "Generate Family Tree"}
//             </span>
//             <ArrowRight className="h-4 w-4" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GedcomUpload;

/////////////////////////////////////////////////

import React, { useState } from "react";
import { Upload, FileText, ArrowRight } from "lucide-react";
import { PersonListView } from "./PersonListView";  // Updated import


const updateGedcomContent = (content, updatedPerson) => {
  const lines = content.split('\n');
  let inPersonBlock = false;
  let currentPerson = null;
  
  return lines.map(line => {
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
  }).join('\n');
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
            default:
              // Handle other tags if needed
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
              // Handle other family tags if needed
              break;
          }
        }
      }
    });

    const start = "I1";
    return { start, persons, unions, links };
  };

  const addChildToGedcom = (content, childData, parentUnionId) => {
    const lines = content.split('\n');
    
    // Create new individual entry
    const individualEntry = [
      `0 @${childData.id}@ INDI`,
      `1 NAME ${childData.name}`,
      `1 SEX ${childData.gender}`,
      `1 BIRT`,
      `2 DATE ${childData.birthyear}`,
      `2 PLAC ${childData.birthplace}`
    ];
    
    // Find the right place to insert the new individual
    let lastIndiIndex = lines.length - 1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('INDI')) {
        lastIndiIndex = i;
        break;
      }
    }
    
    // Insert individual entry
    lines.splice(lastIndiIndex + 1, 0, ...individualEntry);
    
    // Add child to family
    const familyLineIndex = lines.findIndex(line => line.includes(`@${parentUnionId}@ FAM`));
    if (familyLineIndex !== -1) {
      lines.splice(familyLineIndex + 1, 0, `1 CHIL @${childData.id}@`);
    }
    
    return lines.join('\n');
  };
  
  const handleAddChild = (childData, parentPerson) => {
    // Validate parent has unions
    if (!parentPerson || !parentPerson.own_unions || parentPerson.own_unions.length === 0) {
      setError("Cannot add child: Parent has no family unit");
      return;
    }
  
    // Get parent's union
    const parentUnionId = parentPerson.own_unions[0];
    
    try {
      // Update GEDCOM content
      const updatedContent = addChildToGedcom(gedcomContent, childData, parentUnionId);
      setGedcomContent(updatedContent);
      
      // Update parsed data
      const updatedData = parseGEDCOM(updatedContent);
      setParsedData(updatedData);
      onDataParsed(updatedData);
      
      // Clear any existing errors
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
      const data = parseGEDCOM(gedcomContent);
      setParsedData(data);
      onDataParsed(data);
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
        [updatedPerson.id]: updatedPerson
      }
    };
    
    // Update GEDCOM content
    const updatedGedcomContent = updateGedcomContent(gedcomContent, updatedPerson);
    
    // Update all states
    setGedcomContent(updatedGedcomContent);
    setParsedData(updatedData);
    onDataParsed(updatedData);
  };

  const handleDownloadGedcom = () => {
    const blob = new Blob([gedcomContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.ged', '_updated.ged');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                  {gedcomContent.split('\n').length} lines
                </span>
              </div>
              <div className="h-64 overflow-y-auto p-4 font-mono text-sm whitespace-pre text-gray-600">
                {gedcomContent.split('\n').map((line, index) => (
                  <div key={index} className="flex">
                    <span className="text-gray-400 w-12 select-none">{index + 1}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 text-red-700 bg-red-50 rounded-md">{error}</div>
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
          />
        </div>
      )}
    </div>
  );
};

export default GedcomUpload;
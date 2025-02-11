// import React, { useState } from "react";
// import { Upload, FileText, ArrowRight } from "lucide-react";

// const GedcomUpload = ({ onDataParsed }) => {
//   const [gedcomContent, setGedcomContent] = useState("");
//   const [isFileUploaded, setIsFileUploaded] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const [error, setError] = useState(null);

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

//     // Find the starting person (person with ID "I1")
//     const start = "I1";

//     return {
//       start,
//       persons,
//       unions,
//       links,
//     };
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
//         try {
//           const parsedData = parseGEDCOM(content);
//           onDataParsed(parsedData);
//           setError(null);
//         } catch (err) {
//           setError("Error parsing GEDCOM file");
//         }
//       };
//       reader.readAsText(file);
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
//         </div>
//       )}
//     </div>
//   );
// };

// export default GedcomUpload;

// ********************************************************************************

import React, { useState } from "react";
import { Upload, FileText, ArrowRight } from "lucide-react";

const GedcomUpload = ({ onDataParsed }) => {
  const [gedcomContent, setGedcomContent] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
          }
        }
      }
    });

    const start = "I1";
    return { start, persons, unions, links };
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
      onDataParsed(parsedData);
      setError(null);
    } catch (err) {
      setError("Error parsing GEDCOM file");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-6 max-w-2xl mx-auto">
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
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-medium text-gray-700">File Preview</h2>
            </div>
            <div className="h-32 overflow-y-auto p-4 font-mono text-sm whitespace-pre text-gray-600">
              {gedcomContent}
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
        </div>
      )}
    </div>
  );
};

export default GedcomUpload;

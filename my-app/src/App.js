// import "./App.css";
// import "./styles/main.css";
// import React, { useState } from "react";
// import FamilyTreeComponent from "./Updated/FamilyTreeComponent";
// import GedcomUpload from "./Updated/GedcomUpload";

// const App = () => {
//   const [visualizationData, setVisualizationData] = useState(null);

//   const handleParsedData = (parsedData) => {
//     if (parsedData) {
//       setVisualizationData(parsedData);
//     }
//     console.log(parsedData);
//   };

//   return (
//     <div className="p-4 max-w-full">
//       <h1 className="text-2xl font-bold text-center mb-6">
//         Family Tree Generator
//       </h1>
//       <GedcomUpload onDataParsed={handleParsedData} />
//       {visualizationData && (
//         <FamilyTreeComponent
//           data={visualizationData}
//           width={window.innerWidth - 32}
//           height={window.innerHeight - 32}
//         />
//       )}
//     </div>
//   );
// };

// export default App;

import "./App.css";
import "./styles/main.css";
import React, { useState, createContext, useContext } from "react";
import FamilyTreeComponent from "./Updated/FamilyTreeComponent";
import GedcomUpload from "./Updated/GedcomUpload";

// Create context for global state
export const FamilyTreeContext = createContext();

const App = () => {
  const [visualizationData, setVisualizationData] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleParsedData = (parsedData) => {
    if (parsedData) {
      setVisualizationData(parsedData);
    }
    console.log(parsedData);
  };

  // Create context value
  const contextValue = {
    selectedPerson,
    setSelectedPerson,
    visualizationData,
  };

  return (
    <FamilyTreeContext.Provider value={contextValue}>
      <div className="p-4 max-w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Family Tree Generator
        </h1>
        <GedcomUpload
          onDataParsed={handleParsedData}
          selectedPerson={selectedPerson}
          onPersonSelect={setSelectedPerson}
        />
        {visualizationData && (
          <FamilyTreeComponent
            data={visualizationData}
            width={window.innerWidth - 32}
            height={window.innerHeight - 32}
            onPersonSelect={setSelectedPerson}
          />
        )}
      </div>
    </FamilyTreeContext.Provider>
  );
};

export default App;

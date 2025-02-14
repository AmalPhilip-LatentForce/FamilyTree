// *********************************************************************************************
import React, { useEffect, useRef } from "react";

const FamilyTreeComponent = ({ data, width = 1000, height = 600 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Function to check if external scripts are loaded
    const checkScriptsLoaded = () => {
      return window.d3 && window.FamilyTree;
    };

    // Function to initialize the family tree
    const initializeFamilyTree = () => {
      if (!svgRef.current || !data) return;

      try {
        // Clear existing content
        window.d3.select(svgRef.current).selectAll("*").remove();

        // Create main SVG
        const svg = window.d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${width / 4}, 50)`);

        // Make data globally available for FamilyTree class
        window.familyTreeData = {
          start: data.start,
          persons: data.persons,
          unions: data.unions,
          links: data.links,
        };

        // Create family tree instance
        const FT = new window.FamilyTree(window.familyTreeData, svg);

        // Draw family tree
        FT.draw();
      } catch (error) {
        console.error("Error initializing family tree:", error);
      }
    };

    // Check if scripts are loaded every 100ms until they are available
    const scriptCheckInterval = setInterval(() => {
      if (checkScriptsLoaded()) {
        clearInterval(scriptCheckInterval);
        initializeFamilyTree();
      }
    }, 100);

    // Cleanup function
    return () => {
      clearInterval(scriptCheckInterval);
      if (window.familyTreeData) {
        delete window.familyTreeData;
      }
      if (svgRef.current && window.d3) {
        window.d3.select(svgRef.current).selectAll("*").remove();
      }
    };
  }, [data, width, height]);

  return (
    <div className="family-tree-wrapper">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Family Tree Visualization
      </h1>
      <div
        className="family-tree-container"
        style={{
          width: "100%",
          height: "600px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          ref={svgRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default FamilyTreeComponent;

// *********************************** divide code

// components/FamilyTree/index.jsx

// import React, { useEffect, useRef } from "react";
// import { FamilyTree } from "./FamilyTree";
// import { extendArrayPrototype } from "./utils/ArrayExtensions";

// // Initialize array prototype extension
// extendArrayPrototype();

// const FamilyTreeComponent = ({ data, width = 1000, height = 600 }) => {
//   const svgRef = useRef(null);

//   useEffect(() => {
//     const checkScriptsLoaded = () => {
//       return window.d3;
//     };

//     const initializeFamilyTree = () => {
//       if (!svgRef.current || !data) return;

//       try {
//         window.d3.select(svgRef.current).selectAll("*").remove();

//         const svg = window.d3
//           .select(svgRef.current)
//           .attr("width", width)
//           .attr("height", height)
//           .append("g")
//           .attr("transform", `translate(${width / 4}, 50)`);

//         const familyTreeData = {
//           start: data.start,
//           persons: data.persons,
//           unions: data.unions,
//           links: data.links,
//         };

//         const FT = new FamilyTree(familyTreeData, svg);
//         FT.draw();
//       } catch (error) {
//         console.error("Error initializing family tree:", error);
//       }
//     };

//     const scriptCheckInterval = setInterval(() => {
//       if (checkScriptsLoaded()) {
//         clearInterval(scriptCheckInterval);
//         initializeFamilyTree();
//       }
//     }, 100);

//     return () => {
//       clearInterval(scriptCheckInterval);
//       if (svgRef.current && window.d3) {
//         window.d3.select(svgRef.current).selectAll("*").remove();
//       }
//     };
//   }, [data, width, height]);

//   return (
//     <div className="family-tree-wrapper">
//       <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
//         Family Tree Visualization
//       </h1>
//       <div
//         className="family-tree-container"
//         style={{
//           width: "100%",
//           height: "600px",
//           border: "2px solid #ccc",
//           borderRadius: "8px",
//           backgroundColor: "#ffffff",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <svg
//           ref={svgRef}
//           style={{
//             width: "100%",
//             height: "100%",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default FamilyTreeComponent;

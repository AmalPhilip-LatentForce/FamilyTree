// // import React, { useState, useEffect, useRef } from 'react';
// // import * as d3 from 'd3';

// // const parseGEDCOM = (content) => {
// //   const lines = content.split('\n');
// //   const individuals = {};
// //   const families = {};
// //   let currentEntity = null;
// //   let currentType = null;
// //   let currentSubTag = null;

// //   lines.forEach(line => {
// //     if (!line.trim()) return;
    
// //     const [level, ...rest] = line.trim().split(' ');
// //     const levelNum = parseInt(level);
    
// //     if (levelNum === 0) {
// //       const id = rest[0];
// //       const type = rest[1];
      
// //       if (type === 'INDI') {
// //         currentType = 'INDI';
// //         currentEntity = id.replace(/@/g, '');
// //         individuals[currentEntity] = { 
// //           id: currentEntity,
// //           name: 'Unknown',
// //           gender: 'U',
// //           birth: {}
// //         };
// //       } else if (type === 'FAM') {
// //         currentType = 'FAM';
// //         currentEntity = id.replace(/@/g, '');
// //         families[currentEntity] = { 
// //           id: currentEntity,
// //           husband: null,
// //           wife: null,
// //           children: []
// //         };
// //       } else {
// //         currentType = null;
// //         currentEntity = null;
// //       }
// //     } else if (currentEntity) {
// //       const tag = rest[0];
// //       const value = rest.slice(1).join(' ');

// //       if (currentType === 'INDI') {
// //         switch(tag) {
// //           case 'NAME':
// //             individuals[currentEntity].name = value.replace(/\//g, '').trim() || 'Unknown';
// //             break;
// //           case 'SEX':
// //             individuals[currentEntity].gender = value || 'U';
// //             break;
// //           case 'BIRT':
// //             currentSubTag = 'BIRT';
// //             break;
// //           case 'DATE':
// //             if (currentSubTag === 'BIRT') {
// //               individuals[currentEntity].birth.date = value;
// //             }
// //             break;
// //           default:
// //             break;
// //         }
// //       } else if (currentType === 'FAM') {
// //         switch(tag) {
// //           case 'HUSB':
// //             families[currentEntity].husband = value.replace(/@/g, '');
// //             break;
// //           case 'WIFE':
// //             families[currentEntity].wife = value.replace(/@/g, '');
// //             break;
// //           case 'CHIL':
// //             const childId = value.replace(/@/g, '');
// //             if (!families[currentEntity].children.includes(childId)) {
// //               families[currentEntity].children.push(childId);
// //             }
// //             break;
// //           default:
// //             break;
// //         }
// //       }
// //     }
// //   });

// //   return { individuals, families };
// // };

// // const PersonDetailsPanel = ({ person, onClose, onSave, individuals, families }) => {
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editedPerson, setEditedPerson] = useState(person);
// //   const [selectedRelativePerson, setSelectedRelativePerson] = useState(null);
// //   const [relationship, setRelationship] = useState(null);

// //   const findRelationship = (relativeId) => {
// //     if (!relativeId || !person) {
// //       setRelationship(null);
// //       return;
// //     }

// //     const relativePerson = individuals[relativeId];
    
// //     // Helper function to find all ancestors up to N generations
// //     const findAncestors = (personId, generations = 4) => {
// //       const ancestors = new Set();
// //       const queue = [{id: personId, generation: 0}];
      
// //       while (queue.length > 0) {
// //         const current = queue.shift();
// //         if (current.generation >= generations) continue;
        
// //         // Find parents through families
// //         Object.values(families).forEach(family => {
// //           if (family.children.includes(current.id)) {
// //             if (family.husband) {
// //               ancestors.add(family.husband);
// //               queue.push({id: family.husband, generation: current.generation + 1});
// //             }
// //             if (family.wife) {
// //               ancestors.add(family.wife);
// //               queue.push({id: family.wife, generation: current.generation + 1});
// //             }
// //           }
// //         });
// //       }
// //       return ancestors;
// //     };

// //     // Find all descendants up to N generations
// //     const findDescendants = (personId, generations = 4) => {
// //       const descendants = new Set();
// //       const queue = [{id: personId, generation: 0}];
      
// //       while (queue.length > 0) {
// //         const current = queue.shift();
// //         if (current.generation >= generations) continue;
        
// //         Object.values(families).forEach(family => {
// //           if (family.husband === current.id || family.wife === current.id) {
// //             family.children.forEach(childId => {
// //               descendants.add(childId);
// //               queue.push({id: childId, generation: current.generation + 1});
// //             });
// //           }
// //         });
// //       }
// //       return descendants;
// //     };

// //     // Check for direct relationships first
// //     // Spouse
// //     const isSpouse = Object.values(families).some(family => 
// //       (family.husband === person.id && family.wife === relativeId) ||
// //       (family.wife === person.id && family.husband === relativeId)
// //     );
    
// //     if (isSpouse) {
// //       setRelationship(relativePerson.gender === 'M' ? 'Husband' : 'Wife');
// //       return;
// //     }

// //     // Parent-Child
// //     const parentChildFamily = Object.values(families).find(family => {
// //       const isParent = (family.husband === person.id || family.wife === person.id) && 
// //                       family.children.includes(relativeId);
// //       const isChild = (family.husband === relativeId || family.wife === relativeId) && 
// //                      family.children.includes(person.id);
// //       return isParent || isChild;
// //     });

// //     if (parentChildFamily) {
// //       if (parentChildFamily.children.includes(relativeId)) {
// //         setRelationship(relativePerson.gender === 'M' ? 'Son' : 'Daughter');
// //         return;
// //       } else if (parentChildFamily.children.includes(person.id)) {
// //         setRelationship(relativePerson.gender === 'M' ? 'Father' : 'Mother');
// //         return;
// //       }
// //     }

// //     // Sibling
// //     const areSiblings = Object.values(families).some(family => 
// //       family.children.includes(person.id) && family.children.includes(relativeId)
// //     );

// //     if (areSiblings) {
// //       setRelationship(relativePerson.gender === 'M' ? 'Brother' : 'Sister');
// //       return;
// //     }

// //     // Check for more distant relationships
// //     const personAncestors = findAncestors(person.id);
// //     const personDescendants = findDescendants(person.id);
// //     const relativeAncestors = findAncestors(relativeId);
// //     const relativeDescendants = findDescendants(relativeId);

// //     // Check for uncle/aunt or nephew/niece relationships
// //     const personParents = new Set();
// //     const relativeParents = new Set();
    
// //     Object.values(families).forEach(family => {
// //       if (family.children.includes(person.id)) {
// //         if (family.husband) personParents.add(family.husband);
// //         if (family.wife) personParents.add(family.wife);
// //       }
// //       if (family.children.includes(relativeId)) {
// //         if (family.husband) relativeParents.add(family.husband);
// //         if (family.wife) relativeParents.add(family.wife);
// //       }
// //     });

// //     const isUncleAunt = Array.from(personParents).some(parentId => 
// //       Object.values(families).some(family => 
// //         family.children.includes(parentId) && 
// //         (family.children.includes(relativeId) || family.husband === relativeId || family.wife === relativeId)
// //       )
// //     );

// //     const isNephewNiece = Array.from(relativeParents).some(parentId => 
// //       Object.values(families).some(family => 
// //         family.children.includes(parentId) && 
// //         (family.children.includes(person.id) || family.husband === person.id || family.wife === person.id)
// //       )
// //     );

// //     if (isUncleAunt) {
// //       setRelationship(relativePerson.gender === 'M' ? 'Uncle' : 'Aunt');
// //       return;
// //     }

// //     if (isNephewNiece) {
// //       setRelationship(relativePerson.gender === 'M' ? 'Nephew' : 'Niece');
// //       return;
// //     }

// //     // Cousin check
// //     const hasCommonAncestor = Array.from(personAncestors).some(ancestor => 
// //       relativeAncestors.has(ancestor)
// //     );

// //     if (hasCommonAncestor) {
// //       setRelationship('Cousin');
// //       return;
// //     }

// //     // Grandparent/Grandchild
// //     if (personDescendants.has(relativeId)) {
// //       setRelationship(relativePerson.gender === 'M' ? 'Grandson' : 'Granddaughter');
// //       return;
// //     }

// //     if (relativeDescendants.has(person.id)) {
// //       setRelationship(relativePerson.gender === 'M' ? 'Grandfather' : 'Grandmother');
// //       return;
// //     }

// //     setRelationship('Relative');
// //   };

// //   useEffect(() => {
// //     setEditedPerson(person);
// //     setIsEditing(false);
// //   }, [person]);

// //   const handleChange = (field, value) => {
// //     setEditedPerson(prev => {
// //       if (field === 'birth') {
// //         return {
// //           ...prev,
// //           birth: { ...prev.birth, date: value }
// //         };
// //       }
// //       return {
// //         ...prev,
// //         [field]: value
// //       };
// //     });
// //   };

// //   const handleSave = () => {
// //     onSave(editedPerson);
// //     setIsEditing(false);
// //   };

  
// //   return (
// //     <div className="fixed right-4 top-4 w-80 bg-white p-4 rounded-lg shadow-xl border border-gray-200 z-50">
// //       <div className="flex justify-between items-center mb-4">
// //         <h3 className="text-lg font-semibold text-gray-900">Person Details</h3>
// //         <button 
// //           onClick={onClose}
// //           className="text-gray-400 hover:text-gray-600 focus:outline-none"
// //         >
// //           ×
// //         </button>
// //       </div>
      
// //       {isEditing ? (
// //         <div className="space-y-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
// //             <input
// //               type="text"
// //               value={editedPerson.name || ''}
// //               onChange={(e) => handleChange('name', e.target.value)}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
// //             <select
// //               value={editedPerson.gender || 'U'}
// //               onChange={(e) => handleChange('gender', e.target.value)}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             >
// //               <option value="M">Male</option>
// //               <option value="F">Female</option>
// //               <option value="U">Unknown</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date:</label>
// //             <input
// //               type="text"
// //               value={editedPerson.birth?.date || ''}
// //               onChange={(e) => handleChange('birth', e.target.value)}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //               placeholder="e.g., 1 JAN 1990"
// //             />
// //           </div>
          
// //           <div className="flex gap-2 mt-4">
// //             <button 
// //               onClick={handleSave}
// //               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //             >
// //               Save
// //             </button>
// //             <button 
// //               onClick={() => {
// //                 setIsEditing(false);
// //                 setEditedPerson(person);
// //               }}
// //               className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </div>
// //       ) : (
// //         <div className="space-y-3">
// //           <p className="text-sm"><span className="font-medium">Name:</span> {editedPerson.name || 'Unknown'}</p>
// //           <p className="text-sm"><span className="font-medium">Gender:</span> {editedPerson.gender === 'M' ? 'Male' : editedPerson.gender === 'F' ? 'Female' : 'Unknown'}</p>
// //           <p className="text-sm"><span className="font-medium">Birth Date:</span> {editedPerson.birth?.date || 'Unknown'}</p>

// //           <div className="mt-6 pt-4 border-t border-gray-200">
// //             <h4 className="font-medium text-sm mb-2">Find Relationship</h4>
// //             <select 
// //               value={selectedRelativePerson || ''}
// //               onChange={(e) => {
// //                 const selectedId = e.target.value;
// //                 setSelectedRelativePerson(selectedId);
// //                 findRelationship(selectedId);
// //               }}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
// //             >
// //               <option value="">Select a Person</option>
// //               {Object.values(individuals)
// //                 .filter(ind => ind.id !== person.id)
// //                 .map(ind => (
// //                   <option key={ind.id} value={ind.id}>
// //                     {ind.name}
// //                   </option>
// //                 ))
// //               }
// //             </select>
            
// //             {relationship && (
// //               <div className="bg-gray-50 p-3 rounded-md">
// //                 <p className="text-sm">
// //                   Relationship: <span className="font-medium">{relationship}</span>
// //                 </p>
// //               </div>
// //             )}
// //           </div>

// //           <button 
// //             onClick={() => setIsEditing(true)}
// //             className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //           >
// //             Edit
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const FamilyTree = () => {
// //   const [data, setData] = useState(null);
// //   const [selectedPerson, setSelectedPerson] = useState(null);
// //   const [showDetails, setShowDetails] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [parsedData, setParsedData] = useState(null);
// //   const [gedcomText, setGedcomText] = useState('');
// //   const svgRef = useRef();
// //   const [zoomLevel, setZoomLevel] = useState(1);

// //   const handleFileUpload = (event) => {
// //     const file = event.target.files[0];
// //     setError(null);
// //     setData(null);
// //     setSelectedPerson(null);
// //     setShowDetails(false);
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         try {
// //           const gedcomData = parseGEDCOM(e.target.result);
// //           setParsedData(gedcomData);
// //           setGedcomText(e.target.result);
// //         } catch (err) {
// //           setError('Error parsing GEDCOM file. Please check the file format.');
// //           console.error('Parsing error:', err);
// //         }
// //       };
// //       reader.onerror = () => {
// //         setError('Error reading file. Please try again.');
// //       };
// //       reader.readAsText(file);
// //     }
// //   };
  
// //   const handleTextInput = (event) => {
// //     const text = event.target.value;
// //     setGedcomText(text);
// //     try {
// //       const gedcomData = parseGEDCOM(text);
// //       setParsedData(gedcomData);
// //       setError(null);
// //     } catch (err) {
// //       setError('Error parsing GEDCOM text. Please check the format.');
// //       console.error('Parsing error:', err);
// //     }
// //   };

// //   const handleGenerateTree = () => {
// //     if (!parsedData) {
// //       setError('Please provide GEDCOM data first.');
// //       return;
// //     }
  
// //     const { individuals, families } = parsedData;
// //     if (!individuals || !families || Object.keys(families).length === 0) {
// //       setError('No valid family data found.');
// //       return;
// //     }
  
// //     setError(null);
// //     const rootFamily = Object.values(families)[0];
// //     setData({ individuals, families, rootFamily });
// //   };
  
// //   const handleNodeClick = (person) => {
// //     setSelectedPerson(person);
// //     setShowDetails(true);
// //   };

// //   const handleDetailsSave = (updatedPerson) => {
// //     if (!data) return;
  
// //     const updatedIndividuals = {
// //       ...data.individuals,
// //       [updatedPerson.id]: updatedPerson
// //     };
  
// //     const newData = {
// //       ...data,
// //       individuals: updatedIndividuals
// //     };
  
// //     setData(newData);
// //     setSelectedPerson(updatedPerson);
  
// //     const updatedGedcom = generateUpdatedGEDCOM(updatedIndividuals, data.families);
// //     setGedcomText(updatedGedcom);
// //   };

// //   const handleDownloadGedcom = () => {
// //     const blob = new Blob([gedcomText], { type: 'text/plain' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = 'updated_family_tree.ged';
// //     document.body.appendChild(a);
// //     a.click();
// //     document.body.removeChild(a);
// //     URL.revokeObjectURL(url);
// //   };
// //   useEffect(() => {
// //     if (!data || !svgRef.current) return;
  
// //     const width = 1000;
// //     const height = 600;
// //     const nodeWidth = 100;
// //     const nodeHeight = 35;
// //     const spouseGap = 20;
// //     const levelGap = 80;
    
// //     // Clear previous SVG content
// //     d3.select(svgRef.current).selectAll("*").remove();
  
// //     const svg = d3.select(svgRef.current)
// //       .attr('width', width)
// //       .attr('height', height)
// //       .append('g')
// //       .attr('transform', `translate(${width / 2},50)`);
  
// //     // Modified tree layout to ensure proper centering
// //     const treeLayout = d3.tree()
// //     .nodeSize([nodeWidth * 2.5, nodeHeight * 4])
// //     .separation((a, b) => {
// //       // Adjust separation based on whether nodes share the same parent
// //       if (a.parent === b.parent) {
// //         // If either node is an only child, reduce separation to center it
// //         if (a.parent && a.parent.children.length === 1) {
// //           return 0.8;  // Reduced separation for single children
// //         }
// //         return 1.2;    // Normal sibling separation
// //       }
// //       return 1.8;      // Separation between different parent nodes
// //     });

// //     const centerSingleChildren = (node) => {
// //       if (node.children) {
// //         node.children.forEach(centerSingleChildren);
        
// //         // If there's only one child, adjust its position
// //         if (node.children.length === 1 && node.data.spouse) {
// //           const child = node.children[0];
// //           // Center the child between the parents
// //           child.x = node.x + (nodeWidth + spouseGap) / 2;
// //         }
// //       }
// //       return node;
// //     };
  
// //     // Modified hierarchy creation to handle centering
// //     const createHierarchy = (familyId, processedNodes = new Set()) => {
// //       const family = data.families[familyId];
// //       if (!family) return null;
  
// //       const rootNode = {
// //         id: familyId,
// //         children: [],
// //         family: family,
// //         centerOffset: 0 // Add center offset tracking
// //       };
  
// //       if (family.husband && family.wife) {
// //         rootNode.primary = data.individuals[family.husband];
// //         rootNode.spouse = data.individuals[family.wife];
// //         rootNode.centerOffset = (nodeWidth + spouseGap) / 2; // Center between spouses
// //       }
  
// //       if (family.children) {
// //         const childrenNodes = [];
// //         family.children.forEach(childId => {
// //           if (processedNodes.has(childId)) return;
// //           processedNodes.add(childId);
  
// //           const person = data.individuals[childId];
// //           const childFamilies = Object.values(data.families)
// //             .filter(f => f.husband === childId || f.wife === childId);
  
// //           if (childFamilies.length > 0) {
// //             childFamilies.forEach(childFamily => {
// //               const childNode = {
// //                 id: childId,
// //                 familyId: childFamily.id,
// //                 primary: person,
// //                 spouse: childFamily.husband === childId 
// //                   ? data.individuals[childFamily.wife]
// //                   : data.individuals[childFamily.husband],
// //                 children: [],
// //                 centerOffset: (nodeWidth + spouseGap) / 2
// //               };
  
// //               if (childFamily.children) {
// //                 childFamily.children.forEach(grandChildId => {
// //                   const grandChild = data.individuals[grandChildId];
// //                   childNode.children.push({
// //                     id: grandChildId,
// //                     individual: grandChild,
// //                     centerOffset: nodeWidth / 2
// //                   });
// //                 });
// //               }
// //               childrenNodes.push(childNode);
// //             });
// //           } else {
// //             childrenNodes.push({
// //               id: childId,
// //               individual: person,
// //               centerOffset: nodeWidth / 2
// //             });
// //           }
// //         });
// //         rootNode.children = childrenNodes;
// //       }
  
// //       return rootNode;
// //     };
  
// //     const hierarchy = d3.hierarchy(createHierarchy(data.rootFamily.id));
// //     const treeData = treeLayout(hierarchy);
// //     centerSingleChildren(treeData);

  
// //     // Modified line drawing logic
// //      const drawConnectingLines = () => {
// //     const drawLine = (x1, y1, x2, y2, isSpouseLine = false) => {
// //       svg.append('line')
// //         .attr('x1', x1)
// //         .attr('y1', y1)
// //         .attr('x2', x2)
// //         .attr('y2', y2)
// //         .attr('stroke', '#666')
// //         .attr('stroke-width', isSpouseLine ? 3 : 1.5);
// //     };

// //     treeData.descendants().forEach(d => {
// //       // Draw spouse connections
// //       if (d.data.primary && d.data.spouse) {
// //         const spouseLineY = d.y + nodeHeight/2;
// //         const startX = d.x + nodeWidth;
// //         const endX = d.x + nodeWidth + spouseGap;
// //         drawLine(startX, spouseLineY, endX, spouseLineY, true);
// //       }

// //       // Draw parent-child connections
// //       if (d.children && d.children.length > 0) {
// //         const parentCenterX = d.data.spouse ? 
// //           d.x + nodeWidth + spouseGap/2 : // Center between spouses
// //           d.x + nodeWidth/2;              // Center of single parent
// //         const startY = d.y + nodeHeight;
// //         const midY = startY + (d.children[0].y - startY)/2;

// //         // Draw vertical line from parent center
// //         drawLine(parentCenterX, startY, parentCenterX, midY);

// //         if (d.children.length === 1) {
// //           // For single child, draw straight vertical line
// //           const childX = d.children[0].x + nodeWidth/2;
// //           drawLine(parentCenterX, midY, childX, d.children[0].y);
// //         } else {
// //           // For multiple children, draw connecting lines
// //           const leftX = d.children[0].x + nodeWidth/2;
// //           const rightX = d.children[d.children.length-1].x + nodeWidth/2;
// //           drawLine(leftX, midY, rightX, midY);

// //           d.children.forEach(child => {
// //             const childX = child.x + nodeWidth/2;
// //             drawLine(childX, midY, childX, child.y);
// //           });
// //         }
// //       }
// //     });
// //   };  
// //     // Helper function to draw lines
// //     const drawLine = (x1, y1, x2, y2, isSpouseLine = false) => {
// //       svg.append('line')
// //         .attr('x1', x1)
// //         .attr('y1', y1)
// //         .attr('x2', x2)
// //         .attr('y2', y2)
// //         .attr('stroke', '#666')
// //         .attr('stroke-width', isSpouseLine ? 3 : 1.5);
// //     };
  
// //     // Draw lines first
// //     drawConnectingLines();
  
// //     // Create and draw nodes
// //     const nodes = svg.selectAll('g.node')
// //       .data(treeData.descendants())
// //       .enter()
// //       .append('g')
// //       .attr('class', 'node')
// //       .attr('transform', d => `translate(${d.x},${d.y})`);
  
// //     nodes.each(function(d) {
// //       const node = d3.select(this);
      
// //       if (d.data.primary) {
// //         drawPerson(node, d.data.primary, 0, 0);
// //         if (d.data.spouse) {
// //           drawPerson(node, d.data.spouse, nodeWidth + spouseGap, 0);
// //         }
// //       } else if (d.data.individual) {
// //         drawPerson(node, d.data.individual, 0, 0);
// //       }
// //     });
  
// //     function drawPerson(container, person, x, y) {
// //       const group = container.append('g')
// //         .attr('transform', `translate(${x},${y})`)
// //         .style('cursor', 'pointer')
// //         .on('click', () => handleNodeClick(person));
  
// //       group.append('rect')
// //         .attr('fill', person.gender === 'M' ? '#b8daff' : '#ffd6e5')
// //         .attr('stroke', person.gender === 'M' ? '#84b9ff' : '#ffadd2')
// //         .attr('stroke-width', 2)
// //         .attr('width', nodeWidth)
// //         .attr('height', nodeHeight)
// //         .attr('rx', 5)
// //         .attr('ry', 5);
  
// //       group.append('text')
// //         .attr('x', nodeWidth/2)
// //         .attr('y', nodeHeight/2)
// //         .attr('text-anchor', 'middle')
// //         .attr('dominant-baseline', 'middle')
// //         .attr('font-family', 'Arial')
// //         .attr('font-size', '11px')
// //         .text(person.name);
// //     }
  
// //     // Add zoom behavior
// //     const zoom = d3.zoom()
// //       .scaleExtent([0.3, 2])
// //       .on('zoom', (event) => {
// //         svg.attr('transform', event.transform);
// //         setZoomLevel(event.transform.k);
// //       });
  
// //     d3.select(svgRef.current).call(zoom);
  
// //     // Initial zoom to fit content
// //     const svgElement = svgRef.current;
// //     const bbox = svgElement.getBBox();
// //     const scale = Math.min(
// //       width / bbox.width,
// //       height / bbox.height
// //     ) * 0.9;
    
// //     const transform = d3.zoomIdentity
// //       .translate(
// //         width/2 - bbox.x*scale - bbox.width*scale/2,
// //         height/2 - bbox.y*scale - bbox.height*scale/2
// //       )
// //       .scale(scale);
    
// //     d3.select(svgRef.current)
// //       .transition()
// //       .duration(750)
// //       .call(zoom.transform, transform);
  
// //   }, [data]);

// //   // Replace the return statement in your FamilyTree component with this:
// //   return (
// //     <div className="flex flex-col min-h-screen bg-slate-50 p-4">
// //       {/* Upload Section */}
// //       <div className="mb-4 space-y-4">
// //         <div className="flex flex-wrap gap-4 items-start">
// //           <div className="flex-1 space-y-2">
// //             <input
// //               type="file"
// //               accept=".ged"
// //               onChange={handleFileUpload}
// //               className="block w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             />
// //             <textarea
// //               value={gedcomText}
// //               onChange={handleTextInput}
// //               placeholder="Or paste your GEDCOM data here..."
// //               className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             />
// //           </div>
// //           <button 
// //             onClick={handleGenerateTree}
// //             disabled={!parsedData}
// //             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             Generate Family Tree
// //           </button>
// //         </div>
  
// //         {parsedData && (
// //           <div className="flex items-center gap-2 text-green-600">
// //             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// //             </svg>
// //             <span>Data loaded successfully</span>
// //           </div>
// //         )}
  
// //         {error && (
// //           <div className="p-3 text-red-700 bg-red-50 rounded-md">
// //             {error}
// //           </div>
// //         )}
// //       </div>
  
// //       {/* Tree Visualization */}
// //       <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
// //         <div className="relative w-full h-[calc(100vh-16rem)] overflow-auto">
// //           <svg 
// //             ref={svgRef}
// //             className="min-w-full min-h-full"
// //           />
          
// //           {showDetails && selectedPerson && data?.individuals?.[selectedPerson.id] && (
// //             <PersonDetailsPanel
// //               person={data.individuals[selectedPerson.id]}
// //               onClose={() => setShowDetails(false)}
// //               onSave={handleDetailsSave}
// //               individuals={data.individuals}
// //               families={data.families}
// //             />
// //           )}
// //         </div>
// //       </div>
  
// //       {/* Legend and Controls */}
// //       {data && (
// //         <div className="mt-4 flex justify-between items-center">
// //           <div className="flex items-center gap-4">
// //             <div className="flex items-center gap-2">
// //               <div className="w-4 h-4 rounded border border-blue-300 bg-blue-100"></div>
// //               <span className="text-sm text-gray-600">Male</span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <div className="w-4 h-4 rounded border border-pink-300 bg-pink-100"></div>
// //               <span className="text-sm text-gray-600">Female</span>
// //             </div>
// //           </div>
// //           <button 
// //             onClick={handleDownloadGedcom}
// //             className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
// //           >
// //             Download Updated GEDCOM
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const generateUpdatedGEDCOM = (individuals, families) => {
// //   let gedcom = '0 HEAD\n1 CHAR UTF-8\n';

// //   // Add individuals
// //   Object.values(individuals).forEach(individual => {
// //     gedcom += `0 @${individual.id}@ INDI\n`;
// //     gedcom += `1 NAME ${individual.name}\n`;
// //     gedcom += `1 SEX ${individual.gender}\n`;
// //     if (individual.birth?.date) {
// //       gedcom += '1 BIRT\n';
// //       gedcom += `2 DATE ${individual.birth.date}\n`;
// //     }
// //   });

// //   // Add families
// //   Object.values(families).forEach(family => {
// //     gedcom += `0 @${family.id}@ FAM\n`;
// //     if (family.husband) gedcom += `1 HUSB @${family.husband}@\n`;
// //     if (family.wife) gedcom += `1 WIFE @${family.wife}@\n`;
// //     family.children.forEach(childId => {
// //       gedcom += `1 CHIL @${childId}@\n`;
// //     });
// //   });

// //   gedcom += '0 TRLR\n';
// //   return gedcom;
// // };

// // export default FamilyTree;

// import React, { useState, useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const parseGEDCOM = (content) => {
//   const lines = content.split('\n');
//   const individuals = {};
//   const families = {};
//   let currentEntity = null;
//   let currentType = null;
//   let currentSubTag = null;

//   lines.forEach(line => {
//     if (!line.trim()) return;
    
//     const [level, ...rest] = line.trim().split(' ');
//     const levelNum = parseInt(level);
    
//     if (levelNum === 0) {
//       const id = rest[0];
//       const type = rest[1];
      
//       if (type === 'INDI') {
//         currentType = 'INDI';
//         currentEntity = id.replace(/@/g, '');
//         individuals[currentEntity] = { 
//           id: currentEntity,
//           name: 'Unknown',
//           gender: 'U',
//           birth: {}
//         };
//       } else if (type === 'FAM') {
//         currentType = 'FAM';
//         currentEntity = id.replace(/@/g, '');
//         families[currentEntity] = { 
//           id: currentEntity,
//           husband: null,
//           wife: null,
//           children: []
//         };
//       } else {
//         currentType = null;
//         currentEntity = null;
//       }
//     } else if (currentEntity) {
//       const tag = rest[0];
//       const value = rest.slice(1).join(' ');

//       if (currentType === 'INDI') {
//         switch(tag) {
//           case 'NAME':
//             individuals[currentEntity].name = value.replace(/\//g, '').trim() || 'Unknown';
//             break;
//           case 'SEX':
//             individuals[currentEntity].gender = value || 'U';
//             break;
//           case 'BIRT':
//             currentSubTag = 'BIRT';
//             break;
//           case 'DATE':
//             if (currentSubTag === 'BIRT') {
//               individuals[currentEntity].birth.date = value;
//             }
//             break;
//           default:
//             break;
//         }
//       } else if (currentType === 'FAM') {
//         switch(tag) {
//           case 'HUSB':
//             families[currentEntity].husband = value.replace(/@/g, '');
//             break;
//           case 'WIFE':
//             families[currentEntity].wife = value.replace(/@/g, '');
//             break;
//           case 'CHIL':
//             const childId = value.replace(/@/g, '');
//             if (!families[currentEntity].children.includes(childId)) {
//               families[currentEntity].children.push(childId);
//             }
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   });

//   return { individuals, families };
// };

// const updateRelationship = (individuals, families, person1Id, person2Id, relationType) => {
//   const updatedFamilies = { ...families };
//   const updatedIndividuals = { ...individuals };

//   switch (relationType) {
//     case 'spouse':
//       const existingFamilyId = Object.keys(families).find(famId => 
//         (families[famId].husband === person1Id && families[famId].wife === person2Id) ||
//         (families[famId].wife === person1Id && families[famId].husband === person2Id)
//       );

//       if (!existingFamilyId) {
//         const newFamilyId = `F${Object.keys(families).length + 1}`;
//         const person1Gender = individuals[person1Id].gender;
//         updatedFamilies[newFamilyId] = {
//           id: newFamilyId,
//           husband: person1Gender === 'M' ? person1Id : person2Id,
//           wife: person1Gender === 'F' ? person1Id : person2Id,
//           children: []
//         };
//       }
//       break;

//     case 'child':
//       const parentFamilyId = Object.keys(families).find(famId => 
//         families[famId].husband === person2Id || families[famId].wife === person2Id
//       );

//       if (parentFamilyId) {
//         if (!updatedFamilies[parentFamilyId].children.includes(person1Id)) {
//           updatedFamilies[parentFamilyId].children.push(person1Id);
//         }
//       } else {
//         const newFamilyId = `F${Object.keys(families).length + 1}`;
//         const isParentMale = individuals[person2Id].gender === 'M';
//         updatedFamilies[newFamilyId] = {
//           id: newFamilyId,
//           husband: isParentMale ? person2Id : null,
//           wife: isParentMale ? null : person2Id,
//           children: [person1Id]
//         };
//       }
//       break;

//     case 'parent':
//       const childFamilyId = Object.keys(families).find(famId => 
//         families[famId].children.includes(person1Id)
//       );

//       if (childFamilyId) {
//         const isParentMale = individuals[person2Id].gender === 'M';
//         if (isParentMale) {
//           updatedFamilies[childFamilyId].husband = person2Id;
//         } else {
//           updatedFamilies[childFamilyId].wife = person2Id;
//         }
//       } else {
//         const newFamilyId = `F${Object.keys(families).length + 1}`;
//         const isParentMale = individuals[person2Id].gender === 'M';
//         updatedFamilies[newFamilyId] = {
//           id: newFamilyId,
//           husband: isParentMale ? person2Id : null,
//           wife: isParentMale ? null : person2Id,
//           children: [person1Id]
//         };
//       }
//       break;
//   }

//   return { updatedFamilies, updatedIndividuals };
// };

// // NewIndividualForm.js
// const NewIndividualForm = ({ onSubmit, onCancel }) => {
//   const [newPerson, setNewPerson] = useState({
//     name: '',
//     gender: 'U',
//     birth: { date: '' }
//   });

//   const handleChange = (field, value) => {
//     setNewPerson(prev => {
//       if (field === 'birth') {
//         return {
//           ...prev,
//           birth: { ...prev.birth, date: value }
//         };
//       }
//       return {
//         ...prev,
//         [field]: value
//       };
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(newPerson);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
//         <input
//           type="text"
//           value={newPerson.name}
//           onChange={(e) => handleChange('name', e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
//         <select
//           value={newPerson.gender}
//           onChange={(e) => handleChange('gender', e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         >
//           <option value="M">Male</option>
//           <option value="F">Female</option>
//           <option value="U">Unknown</option>
//         </select>
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date:</label>
//         <input
//           type="text"
//           value={newPerson.birth.date}
//           onChange={(e) => handleChange('birth', e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           placeholder="e.g., 1 JAN 1990"
//         />
//       </div>
//       <div className="flex gap-2">
//         <button
//           type="submit"
//           className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           Add Person
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// const PersonDetailsPanel = ({ person, onClose, onSave, individuals, families, onUpdateRelationships, onAddNewIndividual }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedPerson, setEditedPerson] = useState(person);
//   const [selectedRelativePerson, setSelectedRelativePerson] = useState(null);
//   const [relationship, setRelationship] = useState(null);
//   const [isAddingRelationship, setIsAddingRelationship] = useState(false);
//   const [newRelationType, setNewRelationType] = useState('');
//   const [isCreatingNewPerson, setIsCreatingNewPerson] = useState(false);
//   const [showExistingPeople, setShowExistingPeople] = useState(false);

//   useEffect(() => {
//     setEditedPerson(person);
//     setIsEditing(false);
//   }, [person]);

//   const handleNewPersonSubmit = async (newPerson) => {
//     try {
//       // Generate a new unique ID for the person
//       const newId = `I${Object.keys(individuals).length + 1}`;
//       const newIndividual = {
//         ...newPerson,
//         id: newId
//       };

//       // Add the new person and create the relationship
//       await onAddNewIndividual(newIndividual, person.id, newRelationType);
      
//       // Reset states
//       setIsCreatingNewPerson(false);
//       setNewRelationType('');
//       setIsAddingRelationship(false);
//     } catch (error) {
//       console.error('Error adding new person:', error);
//     }
//   };

//   const handleAddRelationshipClick = () => {
//     setIsAddingRelationship(true);
//     setShowExistingPeople(false);
//   };

//   const RelationshipOptions = () => (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h4 className="font-medium text-sm">Add New Relationship</h4>
//         <button
//           onClick={() => setIsAddingRelationship(false)}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           ×
//         </button>
//       </div>
      
//       <div className="space-y-2">
//         <select
//           value={newRelationType}
//           onChange={(e) => setNewRelationType(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         >
//           <option value="">Select Relationship Type</option>
//           <option value="spouse">Spouse</option>
//           <option value="parent">Parent</option>
//           <option value="child">Child</option>
//         </select>

//         {newRelationType && (
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <button
//                 onClick={() => setIsCreatingNewPerson(true)}
//                 className="text-sm text-blue-600 hover:text-blue-800"
//               >
//                 Add New Person
//               </button>
//               <button
//                 onClick={() => setShowExistingPeople(true)}
//                 className="text-sm text-blue-600 hover:text-blue-800"
//               >
//                 Select Existing Person
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const ExistingPeopleSelector = () => (
//     <div className="space-y-4">
//       <select
//         onChange={(e) => {
//           onUpdateRelationships(person.id, e.target.value, newRelationType);
//           setIsAddingRelationship(false);
//           setNewRelationType('');
//           setShowExistingPeople(false);
//         }}
//         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       >
//         <option value="">Select Person</option>
//         {Object.values(individuals)
//           .filter(ind => ind.id !== person.id)
//           .map(ind => (
//             <option key={ind.id} value={ind.id}>
//               {ind.name}
//             </option>
//           ))
//         }
//       </select>
//     </div>
//   );

//   return (
//     <div className="fixed right-4 top-4 w-80 bg-white p-4 rounded-lg shadow-xl border border-gray-200 z-50">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">Person Details</h3>
//         <button 
//           onClick={onClose}
//           className="text-gray-400 hover:text-gray-600 focus:outline-none"
//         >
//           ×
//         </button>
//       </div>

//       {isCreatingNewPerson ? (
//         <NewIndividualForm
//           onSubmit={handleNewPersonSubmit}
//           onCancel={() => {
//             setIsCreatingNewPerson(false);
//             setNewRelationType('');
//           }}
//         />
//       ) : isAddingRelationship ? (
//         showExistingPeople ? (
//           <ExistingPeopleSelector />
//         ) : (
//           <RelationshipOptions />
//         )
//       ) : (
//         <>
//           {/* Regular person details view */}
//           <div className="space-y-3">
//             <p className="text-sm"><span className="font-medium">Name:</span> {editedPerson.name || 'Unknown'}</p>
//             <p className="text-sm"><span className="font-medium">Gender:</span> {editedPerson.gender === 'M' ? 'Male' : editedPerson.gender === 'F' ? 'Female' : 'Unknown'}</p>
//             <p className="text-sm"><span className="font-medium">Birth Date:</span> {editedPerson.birth?.date || 'Unknown'}</p>

//             {/* Current Relationships Display */}
//             <div className="mt-4 border-t border-gray-200 pt-4">
//               <div className="flex justify-between items-center mb-2">
//                 <h4 className="font-medium text-sm">Relationships</h4>
//                 <button
//                   onClick={handleAddRelationshipClick}
//                   className="text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   Add Relationship
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 {Object.values(families).map(family => {
//                   const relationships = [];
                  
//                   if (family.husband === person.id && family.wife) {
//                     relationships.push({
//                       type: 'Spouse',
//                       person: individuals[family.wife]
//                     });
//                   }
                  
//                   if (family.wife === person.id && family.husband) {
//                     relationships.push({
//                       type: 'Spouse',
//                       person: individuals[family.husband]
//                     });
//                   }
                  
//                   if (family.children.includes(person.id)) {
//                     if (family.husband) {
//                       relationships.push({
//                         type: 'Father',
//                         person: individuals[family.husband]
//                       });
//                     }
//                     if (family.wife) {
//                       relationships.push({
//                         type: 'Mother',
//                         person: individuals[family.wife]
//                       });
//                     }
//                   }
                  
//                   if (family.husband === person.id || family.wife === person.id) {
//                     family.children.forEach(childId => {
//                       relationships.push({
//                         type: 'Child',
//                         person: individuals[childId]
//                       });
//                     });
//                   }
                  
//                   return relationships.map((rel, idx) => (
//                     <div key={`${family.id}-${idx}`} className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                       <span className="text-sm">
//                         {rel.type}: {rel.person.name}
//                       </span>
//                       <button
//                         onClick={() => {
//                           const updatedFamilies = { ...families };
//                           delete updatedFamilies[family.id];
//                           onUpdateRelationships(null, null, null, updatedFamilies);
//                         }}
//                         className="text-red-600 hover:text-red-800 text-sm"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ));
//                 }).flat()}
//               </div>
//             </div>

//             <button 
//               onClick={() => setIsEditing(true)}
//               className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Edit Details
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const FamilyTree = () => {
//   const [data, setData] = useState(null);
//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [error, setError] = useState(null);
//   const [parsedData, setParsedData] = useState(null);
//   const [gedcomText, setGedcomText] = useState('');
//   const svgRef = useRef();
//   const [zoomLevel, setZoomLevel] = useState(1);


//   const handleAddNewIndividual = async (newPerson, relatedPersonId, relationType) => {
//     if (!data) return;
  
//     // Mark the new person as newly added for visualization
//     const newPersonWithFlag = {
//       ...newPerson,
//       isNew: true // This flag will be used for highlighting new nodes
//     };
  
//     // Add the new person to individuals
//     const updatedIndividuals = {
//       ...data.individuals,
//       [newPerson.id]: newPersonWithFlag
//     };
  
//     // Create or update relationships
//     let updatedFamilies = { ...data.families };
    
//     switch (relationType) {
//       case 'spouse':
//         // Create a new family for the spouse relationship
//         const newFamilyId = `F${Object.keys(data.families).length + 1}`;
//         const existingPerson = data.individuals[relatedPersonId];
        
//         updatedFamilies[newFamilyId] = {
//           id: newFamilyId,
//           husband: existingPerson.gender === 'M' ? relatedPersonId : newPerson.id,
//           wife: existingPerson.gender === 'F' ? relatedPersonId : newPerson.id,
//           children: []
//         };
//         break;
  
//       case 'child':
//         // Find the family where the related person is a parent
//         const parentFamilyId = Object.keys(data.families).find(famId => 
//           data.families[famId].husband === relatedPersonId || 
//           data.families[famId].wife === relatedPersonId
//         );
  
//         if (parentFamilyId) {
//           // Add child to existing family
//           updatedFamilies[parentFamilyId] = {
//             ...updatedFamilies[parentFamilyId],
//             children: [...updatedFamilies[parentFamilyId].children, newPerson.id]
//           };
//         } else {
//           // Create new family with the parent
//           const newFamilyId = `F${Object.keys(data.families).length + 1}`;
//           const isParentMale = data.individuals[relatedPersonId].gender === 'M';
          
//           updatedFamilies[newFamilyId] = {
//             id: newFamilyId,
//             husband: isParentMale ? relatedPersonId : null,
//             wife: isParentMale ? null : relatedPersonId,
//             children: [newPerson.id]
//           };
//         }
//         break;
  
//       case 'parent':
//         // Find if the child is already in a family
//         const childFamilyId = Object.keys(data.families).find(famId => 
//           data.families[famId].children.includes(relatedPersonId)
//         );
  
//         if (childFamilyId) {
//           // Add parent to existing family
//           const isNewParentMale = newPerson.gender === 'M';
//           updatedFamilies[childFamilyId] = {
//             ...updatedFamilies[childFamilyId],
//             husband: isNewParentMale ? newPerson.id : updatedFamilies[childFamilyId].husband,
//             wife: isNewParentMale ? updatedFamilies[childFamilyId].wife : newPerson.id
//           };
//         } else {
//           // Create new family with the child
//           const newFamilyId = `F${Object.keys(data.families).length + 1}`;
//           const isNewParentMale = newPerson.gender === 'M';
          
//           updatedFamilies[newFamilyId] = {
//             id: newFamilyId,
//             husband: isNewParentMale ? newPerson.id : null,
//             wife: isNewParentMale ? null : newPerson.id,
//             children: [relatedPersonId]
//           };
//         }
//         break;
//     }
  
//     const updatedData = {
//       ...data,
//       individuals: updatedIndividuals,
//       families: updatedFamilies
//     };
  
//     // Update the state and trigger visualization update
//     setData(updatedData);
    
//     // Update GEDCOM text
//     const updatedGedcom = generateUpdatedGEDCOM(updatedIndividuals, updatedFamilies);
//     setGedcomText(updatedGedcom);
  
//     // After a delay,// After a delay, remove the "new" flag from the added person
//   setTimeout(() => {
//     setData(prevData => ({
//       ...prevData,
//       individuals: {
//         ...prevData.individuals,
//         [newPerson.id]: {
//           ...prevData.individuals[newPerson.id],
//           isNew: false
//         }
//       }
//     }));
//   }, 5000); // Remove highlight after 5 seconds

//   return newPerson.id;
// };

// const findOptimalRootFamily = (families, individuals) => {
//   // Try to find a family with multiple generations
//   const familyScores = Object.values(families).map(family => {
//     let score = 0;
    
//     // Add points for having both parents
//     if (family.husband && family.wife) score += 2;
    
//     // Add points for each child
//     score += family.children.length;
    
//     // Add points for children who are parents themselves
//     family.children.forEach(childId => {
//       const childFamilies = Object.values(families).filter(f => 
//         f.husband === childId || f.wife === childId
//       );
//       if (childFamilies.length > 0) score += 3;
//     });

//     return { family, score };
//   });

//   // Sort by score and return the highest scoring family
//   const sortedFamilies = familyScores.sort((a, b) => b.score - a.score);
//   return sortedFamilies[0]?.family || Object.values(families)[0];
// };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     setError(null);
//     setData(null);
//     setSelectedPerson(null);
//     setShowDetails(false);
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const gedcomData = parseGEDCOM(e.target.result);
//           setParsedData(gedcomData);
//           setGedcomText(e.target.result);
//         } catch (err) {
//           setError('Error parsing GEDCOM file. Please check the file format.');
//           console.error('Parsing error:', err);
//         }
//       };
//       reader.onerror = () => {
//         setError('Error reading file. Please try again.');
//       };
//       reader.readAsText(file);
//     }
//   };
  
//   const handleTextInput = (event) => {
//     const text = event.target.value;
//     setGedcomText(text);
//     try {
//       const gedcomData = parseGEDCOM(text);
//       setParsedData(gedcomData);
//       setError(null);
//     } catch (err) {
//       setError('Error parsing GEDCOM text. Please check the format.');
//       console.error('Parsing error:', err);
//     }
//   };

//   const handleGenerateTree = () => {
//     if (!parsedData) {
//       setError('Please provide GEDCOM data first.');
//       return;
//     }
  
//     const { individuals, families } = parsedData;
//     if (!individuals || !families || Object.keys(families).length === 0) {
//       setError('No valid family data found.');
//       return;
//     }
  
//     setError(null);
//     const rootFamily = Object.values(families)[0];
//     setData({ individuals, families, rootFamily });
//   };
  
//   const handleNodeClick = (person) => {
//     setSelectedPerson(person);
//     setShowDetails(true);
//   };

//   const handleDetailsSave = (updatedPerson) => {
//     if (!data) return;
  
//     const updatedIndividuals = {
//       ...data.individuals,
//       [updatedPerson.id]: updatedPerson
//     };
  
//     const newData = {
//       ...data,
//       individuals: updatedIndividuals
//     };
  
//     setData(newData);
//     setSelectedPerson(updatedPerson);
  
//     // Update GEDCOM text
//     const updatedGedcom = generateUpdatedGEDCOM(updatedIndividuals, data.families);
//     setGedcomText(updatedGedcom);
  
//     // Trigger tree update
//     updateTreeVisualization(newData);
//   };
  
//   // Add function to validate family structure
//   const validateFamilyStructure = (families, individuals) => {
//     const validatedFamilies = { ...families };
//     let hasChanges = false;
  
//     Object.keys(validatedFamilies).forEach(familyId => {
//       const family = validatedFamilies[familyId];
      
//       // Validate husband exists
//       if (family.husband && !individuals[family.husband]) {
//         family.husband = null;
//         hasChanges = true;
//       }
      
//       // Validate wife exists
//       if (family.wife && !individuals[family.wife]) {
//         family.wife = null;
//         hasChanges = true;
//       }
      
//       // Validate children exist
//       family.children = family.children.filter(childId => individuals[childId]);
      
//       // Remove empty families
//       if (!family.husband && !family.wife && family.children.length === 0) {
//         delete validatedFamilies[familyId];
//         hasChanges = true;
//       }
//     });
  
//     return { validatedFamilies, hasChanges };
//   };
  
//   // Add function to update tree visualization
//   const updateTreeVisualization = (newData) => {
//     // Validate family structure
//     const { validatedFamilies, hasChanges } = validateFamilyStructure(
//       newData.families,
//       newData.individuals
//     );
  
//     if (hasChanges) {
//       newData = {
//         ...newData,
//         families: validatedFamilies
//       };
//     }
  
//     // Find optimal root family
//     const rootFamily = findOptimalRootFamily(newData.families, newData.individuals);
    
//     if (rootFamily) {
//       newData = {
//         ...newData,
//         rootFamily
//       };
//     }
  
//     setData(newData);
//   };
  
//   // Add a helper function to generate unique IDs
//   const generateUniqueId = (prefix, existingIds) => {
//     let counter = Object.keys(existingIds).length + 1;
//     let newId = `${prefix}${counter}`;
    
//     while (existingIds[newId]) {
//       counter++;
//       newId = `${prefix}${counter}`;
//     }
    
//     return newId;
//   };

//   const handleRelationshipUpdate = (person1Id, person2Id, relationType, forcedFamilies = null) => {
//     if (!data) return;
  
//     let updatedData;
//     if (forcedFamilies) {
//       updatedData = {
//         ...data,
//         families: forcedFamilies
//       };
//     } else {
//       const { updatedFamilies, updatedIndividuals } = updateRelationship(
//         data.individuals,
//         data.families,
//         person1Id,
//         person2Id,
//         relationType
//       );
  
//       updatedData = {
//         ...data,
//         families: updatedFamilies,
//         individuals: updatedIndividuals
//       };
//     }
  
//     setData(updatedData);
    
//     // Update GEDCOM text
//     const updatedGedcom = generateUpdatedGEDCOM(updatedData.individuals, updatedData.families);
//     setGedcomText(updatedGedcom);
//   };

//   const handleDownloadGedcom = () => {
//     const blob = new Blob([gedcomText], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'updated_family_tree.ged';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   useEffect(() => {
//     if (!data || !svgRef.current) return;
  
//     const width = 1000;
//     const height = 600;
//     const nodeWidth = 100;
//     const nodeHeight = 35;
//     const spouseGap = 20;
    
//     // Clear previous SVG content
//     d3.select(svgRef.current).selectAll("*").remove();
  
//     const svg = d3.select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${width / 2},50)`);
  
//     // Enhanced tree layout with better spacing
//     const treeLayout = d3.tree()
//       .nodeSize([nodeWidth * 2.5, nodeHeight * 4])
//       .separation((a, b) => {
//         // Improved separation logic for better spacing
//         if (a.parent === b.parent) {
//           if (a.parent && a.parent.children.length === 1) {
//             return 0.8;
//           }
//           // Increase spacing between siblings with spouses
//           if ((a.data.spouse || b.data.spouse) && a.parent.children.length > 1) {
//             return 1.8;
//           }
//           return 1.2;
//         }
//         return 2;
//       });
  
//     // Enhanced hierarchy creation with better root family selection
//     const createHierarchy = (families, individuals) => {
//       const processedNodes = new Set();
      
//       // Helper function to find the most suitable root family
//       const findRootFamily = () => {
//         // First try to find a family with both parents and children
//         let rootFamily = Object.values(families).find(f => 
//           f.husband && f.wife && f.children.length > 0
//         );
        
//         // If not found, look for any family with children
//         if (!rootFamily) {
//           rootFamily = Object.values(families).find(f => 
//             f.children.length > 0
//           );
//         }
        
//         // If still not found, use the first family
//         if (!rootFamily) {
//           rootFamily = Object.values(families)[0];
//         }
        
//         return rootFamily;
//       };
  
//       const rootFamily = findRootFamily();
//       if (!rootFamily) return null;
  
//       const buildFamilyNode = (family, level = 0) => {
//         if (!family || level > 10) return null; // Prevent infinite recursion
  
//         const node = {
//           id: family.id,
//           children: [],
//           level
//         };
  
//         // Add spouse information
//         if (family.husband && family.wife) {
//           node.primary = individuals[family.husband];
//           node.spouse = individuals[family.wife];
//         } else if (family.husband) {
//           node.primary = individuals[family.husband];
//         } else if (family.wife) {
//           node.primary = individuals[family.wife];
//         }
  
//         // Process children with improved handling
//         if (family.children && family.children.length > 0) {
//           family.children.forEach(childId => {
//             if (processedNodes.has(childId)) return;
//             processedNodes.add(childId);
  
//             const person = individuals[childId];
//             // Find families where this child is a parent
//             const childFamilies = Object.values(families).filter(f => 
//               f.husband === childId || f.wife === childId
//             );
  
//             if (childFamilies.length > 0) {
//               childFamilies.forEach(childFamily => {
//                 const childNode = buildFamilyNode(childFamily, level + 1);
//                 if (childNode) {
//                   node.children.push(childNode);
//                 }
//               });
//             } else {
//               node.children.push({
//                 id: childId,
//                 individual: person
//               });
//             }
//           });
//         }
  
//         return node;
//       };
  
//       return buildFamilyNode(rootFamily);
//     };
  
//     const hierarchy = d3.hierarchy(createHierarchy(data.families, data.individuals));
//     const treeData = treeLayout(hierarchy);
  
//     // Enhanced line drawing with smoother curves
//     const drawConnectingLines = () => {
//       // Diagonal generator for curved lines
//       const diagonal = d3.linkHorizontal()
//         .x(d => d.x)
//         .y(d => d.y);
  
//       const drawLine = (x1, y1, x2, y2, isSpouseLine = false) => {
//         if (isSpouseLine) {
//           // Straight line for spouses
//           svg.append('line')
//             .attr('x1', x1)
//             .attr('y1', y1)
//             .attr('x2', x2)
//             .attr('y2', y2)
//             .attr('stroke', '#666')
//             .attr('stroke-width', 3)
//             .attr('stroke-dasharray', '5,5');
//         } else {
//           // Curved lines for parent-child relationships
//           const midY = (y1 + y2) / 2;
//           const path = d3.path();
//           path.moveTo(x1, y1);
//           path.bezierCurveTo(x1, midY, x2, midY, x2, y2);
          
//           svg.append('path')
//             .attr('d', path.toString())
//             .attr('fill', 'none')
//             .attr('stroke', '#666')
//             .attr('stroke-width', 1.5);
//         }
//       };
  
//       treeData.descendants().forEach(d => {
//         // Draw spouse connections
//         if (d.data.primary && d.data.spouse) {
//           const spouseLineY = d.y + nodeHeight/2;
//           drawLine(
//             d.x + nodeWidth,
//             spouseLineY,
//             d.x + nodeWidth + spouseGap,
//             spouseLineY,
//             true
//           );
//         }
  
//         // Draw parent-child connections
//         if (d.children && d.children.length > 0) {
//           const parentCenterX = d.data.spouse ? 
//             d.x + nodeWidth + spouseGap/2 : 
//             d.x + nodeWidth/2;
//           const startY = d.y + nodeHeight;
  
//           d.children.forEach(child => {
//             const childX = child.x + nodeWidth/2;
//             drawLine(parentCenterX, startY, childX, child.y);
//           });
//         }
//       });
//     };
  
//     // Draw lines first
//     drawConnectingLines();
  
//     // Enhanced node drawing with animations
//     const nodes = svg.selectAll('g.node')
//       .data(treeData.descendants())
//       .enter()
//       .append('g')
//       .attr('class', 'node')
//       .attr('transform', d => `translate(${d.x},${d.y})`);
  
//     nodes.each(function(d) {
//       const node = d3.select(this);
      
//       if (d.data.primary) {
//         drawPerson(node, d.data.primary, 0, 0, true);
//         if (d.data.spouse) {
//           drawPerson(node, d.data.spouse, nodeWidth + spouseGap, 0, true);
//         }
//       } else if (d.data.individual) {
//         drawPerson(node, d.data.individual, 0, 0, false);
//       }
//     });
  
//     function drawPerson(container, person, x, y, isParent) {
//       const group = container.append('g')
//         .attr('transform', `translate(${x},${y})`)
//         .style('cursor', 'pointer')
//         .on('click', () => handleNodeClick(person));
  
//       // Add entrance animation
//       const rect = group.append('rect')
//         .attr('fill', person.gender === 'M' ? '#b8daff' : 
//               person.gender === 'F' ? '#ffd6e5' : '#f0f0f0')
//         .attr('stroke', person.gender === 'M' ? '#84b9ff' : 
//               person.gender === 'F' ? '#ffadd2' : '#d0d0d0')
//         .attr('stroke-width', 2)
//         .attr('width', 0)
//         .attr('height', nodeHeight)
//         .attr('rx', 5)
//         .attr('ry', 5);
  
//       rect.transition()
//         .duration(500)
//         .attr('width', nodeWidth);
  
//       const text = group.append('text')
//         .attr('x', nodeWidth/2)
//         .attr('y', nodeHeight/2)
//         .attr('text-anchor', 'middle')
//         .attr('dominant-baseline', 'middle')
//         .attr('font-family', 'Arial')
//         .attr('font-size', '11px')
//         .style('opacity', 0)
//         .text(person.name);
  
//       text.transition()
//         .delay(300)
//         .duration(300)
//         .style('opacity', 1);
  
//       // Add highlight effect for new nodes
//       if (person.isNew) {
//         rect.attr('stroke-width', 3)
//           .attr('stroke-dasharray', '5,5');
        
//         group.append('circle')
//           .attr('cx', nodeWidth/2)
//           .attr('cy', -5)
//           .attr('r', 3)
//           .attr('fill', '#4CAF50');
//       }
//     }
  
//     // Enhanced zoom behavior
//     const zoom = d3.zoom()
//       .scaleExtent([0.3, 2])
//       .on('zoom', (event) => {
//         svg.attr('transform', event.transform);
//         setZoomLevel(event.transform.k);
//       });
  
//     d3.select(svgRef.current).call(zoom);
  
//     // Initial zoom to fit content
//     const svgElement = svgRef.current;
//     const bbox = svgElement.getBBox();
//     const scale = Math.min(
//       width / bbox.width,
//       height / bbox.height
//     ) * 0.9;
    
//     const transform = d3.zoomIdentity
//       .translate(
//         width/2 - bbox.x*scale - bbox.width*scale/2,
//         height/2 - bbox.y*scale - bbox.height*scale/2
//       )
//       .scale(scale);
    
//     d3.select(svgRef.current)
//       .transition()
//       .duration(750)
//       .call(zoom.transform, transform);
  
//   }, [data, selectedPerson]);



//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50 p-4">
//       <div className="mb-4 space-y-4">
//         <div className="flex flex-wrap gap-4 items-start">
//           <div className="flex-1 space-y-2">
//             <input
//               type="file"
//               accept=".ged"
//               onChange={handleFileUpload}
//               className="block w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//             <textarea
//               value={gedcomText}
//               onChange={handleTextInput}
//               placeholder="Or paste your GEDCOM data here..."
//               className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <button 
//             onClick={handleGenerateTree}
//             disabled={!parsedData}
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Generate Family Tree
//           </button>
//         </div>

//         {parsedData && (
//           <div className="flex items-center gap-2 text-green-600">
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span>Data loaded successfully</span>
//           </div>
//         )}

//         {error && (
//           <div className="p-3 text-red-700 bg-red-50 rounded-md">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* Tree Visualization */}
//       <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="relative w-full h-[calc(100vh-16rem)] overflow-auto">
//           <svg 
//             ref={svgRef}
//             className="min-w-full min-h-full"
//           />
          
//           {showDetails && selectedPerson && data?.individuals?.[selectedPerson.id] && (
//   <PersonDetailsPanel
//     person={data.individuals[selectedPerson.id]}
//     onClose={() => setShowDetails(false)}
//     onSave={handleDetailsSave}
//     individuals={data.individuals}
//     families={data.families}
//     onUpdateRelationships={handleRelationshipUpdate}
//     onAddNewIndividual={handleAddNewIndividual}
//   />
// )}
//         </div>
//       </div>

//       {/* Legend and Controls */}
//       {data && (
//         <div className="mt-4 flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 rounded border border-blue-300 bg-blue-100"></div>
//               <span className="text-sm text-gray-600">Male</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 rounded border border-pink-300 bg-pink-100"></div>
//               <span className="text-sm text-gray-600">Female</span>
//             </div>
//           </div>
//           <button 
//             onClick={handleDownloadGedcom}
//             className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//           >
//             Download Updated GEDCOM
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const generateUpdatedGEDCOM = (individuals, families) => {
//   let gedcom = '0 HEAD\n1 CHAR UTF-8\n';

//   // Add individuals with potentially new entries
//   Object.values(individuals).forEach(individual => {
//     gedcom += `0 @${individual.id}@ INDI\n`;
//     gedcom += `1 NAME ${individual.name}\n`;
//     gedcom += `1 SEX ${individual.gender}\n`;
//     if (individual.birth?.date) {
//       gedcom += '1 BIRT\n';
//       gedcom += `2 DATE ${individual.birth.date}\n`;
//     }
//   });

//   // Add families with potentially new relationships
//   Object.values(families).forEach(family => {
//     gedcom += `0 @${family.id}@ FAM\n`;
//     if (family.husband) gedcom += `1 HUSB @${family.husband}@\n`;
//     if (family.wife) gedcom += `1 WIFE @${family.wife}@\n`;
//     family.children.forEach(childId => {
//       gedcom += `1 CHIL @${childId}@\n`;
//     });
//   });

//   gedcom += '0 TRLR\n';
//   return gedcom;
// };

// export default FamilyTree;
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const parseGEDCOM = (content) => {
  const lines = content.split('\n');
  const individuals = {};
  const families = {};
  let currentEntity = null;
  let currentType = null;
  let currentSubTag = null;

  lines.forEach(line => {
    if (!line.trim()) return;
    
    const [level, ...rest] = line.trim().split(' ');
    const levelNum = parseInt(level);
    
    if (levelNum === 0) {
      const id = rest[0];
      const type = rest[1];
      
      if (type === 'INDI') {
        currentType = 'INDI';
        currentEntity = id.replace(/@/g, '');
        individuals[currentEntity] = { 
          id: currentEntity,
          name: 'Unknown',
          gender: 'U',
          birth: {}
        };
      } else if (type === 'FAM') {
        currentType = 'FAM';
        currentEntity = id.replace(/@/g, '');
        families[currentEntity] = { 
          id: currentEntity,
          husband: null,
          wife: null,
          children: []
        };
      } else {
        currentType = null;
        currentEntity = null;
      }
    } else if (currentEntity) {
      const tag = rest[0];
      const value = rest.slice(1).join(' ');

      if (currentType === 'INDI') {
        switch(tag) {
          case 'NAME':
            individuals[currentEntity].name = value.replace(/\//g, '').trim() || 'Unknown';
            break;
          case 'SEX':
            individuals[currentEntity].gender = value || 'U';
            break;
          case 'BIRT':
            currentSubTag = 'BIRT';
            break;
          case 'DATE':
            if (currentSubTag === 'BIRT') {
              individuals[currentEntity].birth.date = value;
            }
            break;
          default:
            break;
        }
      } else if (currentType === 'FAM') {
        switch(tag) {
          case 'HUSB':
            families[currentEntity].husband = value.replace(/@/g, '');
            break;
          case 'WIFE':
            families[currentEntity].wife = value.replace(/@/g, '');
            break;
          case 'CHIL':
            const childId = value.replace(/@/g, '');
            if (!families[currentEntity].children.includes(childId)) {
              families[currentEntity].children.push(childId);
            }
            break;
          default:
            break;
        }
      }
    }
  });

  return { individuals, families };
};

const PersonDetailsPanel = ({ person, onClose, onSave, individuals, families }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPerson, setEditedPerson] = useState(person);
  const [selectedRelativePerson, setSelectedRelativePerson] = useState(null);
  const [relationship, setRelationship] = useState(null);

  const findRelationship = (relativeId) => {
    if (!relativeId || !person) {
      setRelationship(null);
      return;
    }

    const relativePerson = individuals[relativeId];
    
    // Helper function to find all ancestors up to N generations
    const findAncestors = (personId, generations = 4) => {
      const ancestors = new Set();
      const queue = [{id: personId, generation: 0}];
      
      while (queue.length > 0) {
        const current = queue.shift();
        if (current.generation >= generations) continue;
        
        // Find parents through families
        Object.values(families).forEach(family => {
          if (family.children.includes(current.id)) {
            if (family.husband) {
              ancestors.add(family.husband);
              queue.push({id: family.husband, generation: current.generation + 1});
            }
            if (family.wife) {
              ancestors.add(family.wife);
              queue.push({id: family.wife, generation: current.generation + 1});
            }
          }
        });
      }
      return ancestors;
    };

    // Find all descendants up to N generations
    const findDescendants = (personId, generations = 4) => {
      const descendants = new Set();
      const queue = [{id: personId, generation: 0}];
      
      while (queue.length > 0) {
        const current = queue.shift();
        if (current.generation >= generations) continue;
        
        Object.values(families).forEach(family => {
          if (family.husband === current.id || family.wife === current.id) {
            family.children.forEach(childId => {
              descendants.add(childId);
              queue.push({id: childId, generation: current.generation + 1});
            });
          }
        });
      }
      return descendants;
    };

    // Check for direct relationships first
    // Spouse
    const isSpouse = Object.values(families).some(family => 
      (family.husband === person.id && family.wife === relativeId) ||
      (family.wife === person.id && family.husband === relativeId)
    );
    
    if (isSpouse) {
      setRelationship(relativePerson.gender === 'M' ? 'Husband' : 'Wife');
      return;
    }

    // Parent-Child
    const parentChildFamily = Object.values(families).find(family => {
      const isParent = (family.husband === person.id || family.wife === person.id) && 
                      family.children.includes(relativeId);
      const isChild = (family.husband === relativeId || family.wife === relativeId) && 
                     family.children.includes(person.id);
      return isParent || isChild;
    });

    if (parentChildFamily) {
      if (parentChildFamily.children.includes(relativeId)) {
        setRelationship(relativePerson.gender === 'M' ? 'Son' : 'Daughter');
        return;
      } else if (parentChildFamily.children.includes(person.id)) {
        setRelationship(relativePerson.gender === 'M' ? 'Father' : 'Mother');
        return;
      }
    }

    // Sibling
    const areSiblings = Object.values(families).some(family => 
      family.children.includes(person.id) && family.children.includes(relativeId)
    );

    if (areSiblings) {
      setRelationship(relativePerson.gender === 'M' ? 'Brother' : 'Sister');
      return;
    }

    // Check for more distant relationships
    const personAncestors = findAncestors(person.id);
    const personDescendants = findDescendants(person.id);
    const relativeAncestors = findAncestors(relativeId);
    const relativeDescendants = findDescendants(relativeId);

    // Check for uncle/aunt or nephew/niece relationships
    const personParents = new Set();
    const relativeParents = new Set();
    
    Object.values(families).forEach(family => {
      if (family.children.includes(person.id)) {
        if (family.husband) personParents.add(family.husband);
        if (family.wife) personParents.add(family.wife);
      }
      if (family.children.includes(relativeId)) {
        if (family.husband) relativeParents.add(family.husband);
        if (family.wife) relativeParents.add(family.wife);
      }
    });

    const isUncleAunt = Array.from(personParents).some(parentId => 
      Object.values(families).some(family => 
        family.children.includes(parentId) && 
        (family.children.includes(relativeId) || family.husband === relativeId || family.wife === relativeId)
      )
    );

    const isNephewNiece = Array.from(relativeParents).some(parentId => 
      Object.values(families).some(family => 
        family.children.includes(parentId) && 
        (family.children.includes(person.id) || family.husband === person.id || family.wife === person.id)
      )
    );

    if (isUncleAunt) {
      setRelationship(relativePerson.gender === 'M' ? 'Uncle' : 'Aunt');
      return;
    }

    if (isNephewNiece) {
      setRelationship(relativePerson.gender === 'M' ? 'Nephew' : 'Niece');
      return;
    }

    // Cousin check
    const hasCommonAncestor = Array.from(personAncestors).some(ancestor => 
      relativeAncestors.has(ancestor)
    );

    if (hasCommonAncestor) {
      setRelationship('Cousin');
      return;
    }

    // Grandparent/Grandchild
    if (personDescendants.has(relativeId)) {
      setRelationship(relativePerson.gender === 'M' ? 'Grandson' : 'Granddaughter');
      return;
    }

    if (relativeDescendants.has(person.id)) {
      setRelationship(relativePerson.gender === 'M' ? 'Grandfather' : 'Grandmother');
      return;
    }

    setRelationship('Relative');
  };

  useEffect(() => {
    setEditedPerson(person);
    setIsEditing(false);
  }, [person]);

  const handleChange = (field, value) => {
    setEditedPerson(prev => {
      if (field === 'birth') {
        return {
          ...prev,
          birth: { ...prev.birth, date: value }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSave = () => {
    onSave(editedPerson);
    setIsEditing(false);
  };

  
  return (
    <div className="fixed right-4 top-4 w-80 bg-white p-4 rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Person Details</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          ×
        </button>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
            <input
              type="text"
              value={editedPerson.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender:</label>
            <select
              value={editedPerson.gender || 'U'}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="U">Unknown</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date:</label>
            <input
              type="text"
              value={editedPerson.birth?.date || ''}
              onChange={(e) => handleChange('birth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1 JAN 1990"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditedPerson(person);
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm"><span className="font-medium">Name:</span> {editedPerson.name || 'Unknown'}</p>
          <p className="text-sm"><span className="font-medium">Gender:</span> {editedPerson.gender === 'M' ? 'Male' : editedPerson.gender === 'F' ? 'Female' : 'Unknown'}</p>
          <p className="text-sm"><span className="font-medium">Birth Date:</span> {editedPerson.birth?.date || 'Unknown'}</p>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-sm mb-2">Find Relationship</h4>
            <select 
              value={selectedRelativePerson || ''}
              onChange={(e) => {
                const selectedId = e.target.value;
                setSelectedRelativePerson(selectedId);
                findRelationship(selectedId);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
            >
              <option value="">Select a Person</option>
              {Object.values(individuals)
                .filter(ind => ind.id !== person.id)
                .map(ind => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))
              }
            </select>
            
            {relationship && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">
                  Relationship: <span className="font-medium">{relationship}</span>
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

const FamilyTree = () => {
  const [data, setData] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [gedcomText, setGedcomText] = useState('');
  const svgRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(1);

  const findRootFamily = (families, individuals) => {
    // Create a set of all individuals who are children
    const childrenSet = new Set();
    Object.values(families).forEach(family => {
      family.children?.forEach(childId => childrenSet.add(childId));
    });
    
    // Find individuals who are not children of anyone (they are the oldest generation)
    const rootIndividuals = Object.keys(individuals).filter(id => !childrenSet.has(id));
    
    // Find the family where these root individuals are parents
    const rootFamily = Object.values(families).find(family => 
      rootIndividuals.includes(family.husband) || rootIndividuals.includes(family.wife)
    );
    
    return rootFamily;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setError(null);
    setData(null);
    setSelectedPerson(null);
    setShowDetails(false);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const gedcomData = parseGEDCOM(e.target.result);
          setParsedData(gedcomData);
          setGedcomText(e.target.result);
        } catch (err) {
          setError('Error parsing GEDCOM file. Please check the file format.');
          console.error('Parsing error:', err);
        }
      };
      reader.onerror = () => {
        setError('Error reading file. Please try again.');
      };
      reader.readAsText(file);
    }
  };
  
  const handleTextInput = (event) => {
    const text = event.target.value;
    setGedcomText(text);
    try {
      const gedcomData = parseGEDCOM(text);
      setParsedData(gedcomData);
      setError(null);
    } catch (err) {
      setError('Error parsing GEDCOM text. Please check the format.');
      console.error('Parsing error:', err);
    }
  };

  const handleGenerateTree = () => {
    if (!parsedData) {
      setError('Please provide GEDCOM data first.');
      return;
    }
  
    const { individuals, families } = parsedData;
    if (!individuals || !families || Object.keys(families).length === 0) {
      setError('No valid family data found.');
      return;
    }
  
    setError(null);
    // Find the root family (oldest generation)
    const rootFamily = findRootFamily(families, individuals);
    if (!rootFamily) {
      setError('Could not determine the root family.');
      return;
    }
    
    setData({ individuals, families, rootFamily });
  };
  const handleNodeClick = (person) => {
    setSelectedPerson(person);
    setShowDetails(true);
  };

  const handleDetailsSave = (updatedPerson) => {
    if (!data) return;
  
    const updatedIndividuals = {
      ...data.individuals,
      [updatedPerson.id]: updatedPerson
    };
  
    const newData = {
      ...data,
      individuals: updatedIndividuals
    };
  
    setData(newData);
    setSelectedPerson(updatedPerson);
  
    const updatedGedcom = generateUpdatedGEDCOM(updatedIndividuals, data.families);
    setGedcomText(updatedGedcom);
  };

  const handleDownloadGedcom = () => {
    const blob = new Blob([gedcomText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_family_tree.ged';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  useEffect(() => {
    if (!data || !svgRef.current) return;
  
    const width = 1000;
    const height = 600;
    const nodeWidth = 100;
    const nodeHeight = 35;
    const spouseGap = 20;
    const levelGap = 80;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();
  
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},50)`);
  
    // Modified tree layout to ensure proper centering
    const treeLayout = d3.tree()
    .nodeSize([nodeWidth * 2.5, nodeHeight * 4])
    .separation((a, b) => {
      // Adjust separation based on whether nodes share the same parent
      if (a.parent === b.parent) {
        // If either node is an only child, reduce separation to center it
        if (a.parent && a.parent.children.length === 1) {
          return 0.8;  // Reduced separation for single children
        }
        return 1.2;    // Normal sibling separation
      }
      return 1.8;      // Separation between different parent nodes
    });

    const centerSingleChildren = (node) => {
      if (node.children) {
        node.children.forEach(centerSingleChildren);
        
        // If there's only one child, adjust its position
        if (node.children.length === 1 && node.data.spouse) {
          const child = node.children[0];
          // Center the child between the parents
          child.x = node.x + (nodeWidth + spouseGap) / 2;
        }
      }
      return node;
    };
  
    // Modified hierarchy creation to handle centering
    const createHierarchy = (familyId, processedNodes = new Set()) => {
      const family = data.families[familyId];
      if (!family) return null;
  
      const rootNode = {
        id: familyId,
        children: [],
        family: family,
        centerOffset: 0 // Add center offset tracking
      };
  
      if (family.husband && family.wife) {
        rootNode.primary = data.individuals[family.husband];
        rootNode.spouse = data.individuals[family.wife];
        rootNode.centerOffset = (nodeWidth + spouseGap) / 2; // Center between spouses
      }
  
      if (family.children) {
        const childrenNodes = [];
        family.children.forEach(childId => {
          if (processedNodes.has(childId)) return;
          processedNodes.add(childId);
  
          const person = data.individuals[childId];
          const childFamilies = Object.values(data.families)
            .filter(f => f.husband === childId || f.wife === childId);
  
          if (childFamilies.length > 0) {
            childFamilies.forEach(childFamily => {
              const childNode = {
                id: childId,
                familyId: childFamily.id,
                primary: person,
                spouse: childFamily.husband === childId 
                  ? data.individuals[childFamily.wife]
                  : data.individuals[childFamily.husband],
                children: [],
                centerOffset: (nodeWidth + spouseGap) / 2
              };
  
              if (childFamily.children) {
                childFamily.children.forEach(grandChildId => {
                  const grandChild = data.individuals[grandChildId];
                  childNode.children.push({
                    id: grandChildId,
                    individual: grandChild,
                    centerOffset: nodeWidth / 2
                  });
                });
              }
              childrenNodes.push(childNode);
            });
          } else {
            childrenNodes.push({
              id: childId,
              individual: person,
              centerOffset: nodeWidth / 2
            });
          }
        });
        rootNode.children = childrenNodes;
      }
  
      return rootNode;
    };
  
    const hierarchy = d3.hierarchy(createHierarchy(data.rootFamily.id));
    const treeData = treeLayout(hierarchy);
    centerSingleChildren(treeData);

  
    // Modified line drawing logic
     const drawConnectingLines = () => {
    const drawLine = (x1, y1, x2, y2, isSpouseLine = false) => {
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#666')
        .attr('stroke-width', isSpouseLine ? 3 : 1.5);
    };

    treeData.descendants().forEach(d => {
      // Draw spouse connections
      if (d.data.primary && d.data.spouse) {
        const spouseLineY = d.y + nodeHeight/2;
        const startX = d.x + nodeWidth;
        const endX = d.x + nodeWidth + spouseGap;
        drawLine(startX, spouseLineY, endX, spouseLineY, true);
      }

      // Draw parent-child connections
      if (d.children && d.children.length > 0) {
        const parentCenterX = d.data.spouse ? 
          d.x + nodeWidth + spouseGap/2 : // Center between spouses
          d.x + nodeWidth/2;              // Center of single parent
        const startY = d.y + nodeHeight;
        const midY = startY + (d.children[0].y - startY)/2;

        // Draw vertical line from parent center
        drawLine(parentCenterX, startY, parentCenterX, midY);

        if (d.children.length === 1) {
          // For single child, draw straight vertical line
          const childX = d.children[0].x + nodeWidth/2;
          drawLine(parentCenterX, midY, childX, d.children[0].y);
        } else {
          // For multiple children, draw connecting lines
          const leftX = d.children[0].x + nodeWidth/2;
          const rightX = d.children[d.children.length-1].x + nodeWidth/2;
          drawLine(leftX, midY, rightX, midY);

          d.children.forEach(child => {
            const childX = child.x + nodeWidth/2;
            drawLine(childX, midY, childX, child.y);
          });
        }
      }
    });
  };  
    // Helper function to draw lines
    const drawLine = (x1, y1, x2, y2, isSpouseLine = false) => {
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#666')
        .attr('stroke-width', isSpouseLine ? 3 : 1.5);
    };
  
    // Draw lines first
    drawConnectingLines();
  
    // Create and draw nodes
    const nodes = svg.selectAll('g.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);
  
    nodes.each(function(d) {
      const node = d3.select(this);
      
      if (d.data.primary) {
        drawPerson(node, d.data.primary, 0, 0);
        if (d.data.spouse) {
          drawPerson(node, d.data.spouse, nodeWidth + spouseGap, 0);
        }
      } else if (d.data.individual) {
        drawPerson(node, d.data.individual, 0, 0);
      }
    });
  
    function drawPerson(container, person, x, y) {
      const group = container.append('g')
        .attr('transform', `translate(${x},${y})`)
        .style('cursor', 'pointer')
        .on('click', () => handleNodeClick(person));
  
      group.append('rect')
        .attr('fill', person.gender === 'M' ? '#b8daff' : '#ffd6e5')
        .attr('stroke', person.gender === 'M' ? '#84b9ff' : '#ffadd2')
        .attr('stroke-width', 2)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 5)
        .attr('ry', 5);
  
      group.append('text')
        .attr('x', nodeWidth/2)
        .attr('y', nodeHeight/2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Arial')
        .attr('font-size', '11px')
        .text(person.name);
    }
  
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 2])
      .on('zoom', (event) => {
        svg.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });
  
    d3.select(svgRef.current).call(zoom);
  
    // Initial zoom to fit content
    const svgElement = svgRef.current;
    const bbox = svgElement.getBBox();
    const scale = Math.min(
      width / bbox.width,
      height / bbox.height
    ) * 0.9;
    
    const transform = d3.zoomIdentity
      .translate(
        width/2 - bbox.x*scale - bbox.width*scale/2,
        height/2 - bbox.y*scale - bbox.height*scale/2
      )
      .scale(scale);
    
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoom.transform, transform);
  
  }, [data]);

  // Replace the return statement in your FamilyTree component with this:
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 p-4">
      {/* Upload Section */}
      <div className="mb-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-start">
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept=".ged"
              onChange={handleFileUpload}
              className="block w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              value={gedcomText}
              onChange={handleTextInput}
              placeholder="Or paste your GEDCOM data here..."
              className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button 
            onClick={handleGenerateTree}
            disabled={!parsedData}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Family Tree
          </button>
        </div>
  
        {parsedData && (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Data loaded successfully</span>
          </div>
        )}
  
        {error && (
          <div className="p-3 text-red-700 bg-red-50 rounded-md">
            {error}
          </div>
        )}
      </div>
  
      {/* Tree Visualization */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full h-[calc(100vh-16rem)] overflow-auto">
          <svg 
            ref={svgRef}
            className="min-w-full min-h-full"
          />
          
          {showDetails && selectedPerson && data?.individuals?.[selectedPerson.id] && (
            <PersonDetailsPanel
              person={data.individuals[selectedPerson.id]}
              onClose={() => setShowDetails(false)}
              onSave={handleDetailsSave}
              individuals={data.individuals}
              families={data.families}
            />
          )}
        </div>
      </div>
  
      {/* Legend and Controls */}
      {data && (
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-blue-300 bg-blue-100"></div>
              <span className="text-sm text-gray-600">Male</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-pink-300 bg-pink-100"></div>
              <span className="text-sm text-gray-600">Female</span>
            </div>
          </div>
          <button 
            onClick={handleDownloadGedcom}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Download Updated GEDCOM
          </button>
        </div>
      )}
    </div>
  );
};

const generateUpdatedGEDCOM = (individuals, families) => {
  let gedcom = '0 HEAD\n1 CHAR UTF-8\n';

  // Add individuals
  Object.values(individuals).forEach(individual => {
    gedcom += `0 @${individual.id}@ INDI\n`;
    gedcom += `1 NAME ${individual.name}\n`;
    gedcom += `1 SEX ${individual.gender}\n`;
    if (individual.birth?.date) {
      gedcom += '1 BIRT\n';
      gedcom += `2 DATE ${individual.birth.date}\n`;
    }
  });

  // Add families
  Object.values(families).forEach(family => {
    gedcom += `0 @${family.id}@ FAM\n`;
    if (family.husband) gedcom += `1 HUSB @${family.husband}@\n`;
    if (family.wife) gedcom += `1 WIFE @${family.wife}@\n`;
    family.children.forEach(childId => {
      gedcom += `1 CHIL @${childId}@\n`;
    });
  });

  gedcom += '0 TRLR\n';
  return gedcom;
};

export default FamilyTree;
export {};

// import React, { useState } from 'react';
// import { Save, Edit, Eye, Send, Undo, Check } from 'lucide-react';

// // Document state interface
// interface DocumentState {
//   onEdit: () => void;
//   onSave: () => void;
//   onSubmit: () => void;
//   onPublish: () => void;
//   onReject: () => void;
//   getActions: () => JSX.Element;
//   getStatusBadge: () => JSX.Element;
// }

// // Document states implementation
// class DraftState implements DocumentState {
//   constructor(private context: DocumentEditor) {}

//   onEdit() {
//     // Already in edit mode
//   }

//   onSave() {
//     this.context.saveContent();
//   }

//   onSubmit() {
//     this.context.setState(new ReviewState(this.context));
//   }

//   onPublish() {
//     // Can't publish from draft
//   }

//   onReject() {
//     // Can't reject from draft
//   }

//   getActions() {
//     return (
//       <div className="flex gap-2">
//         <button
//           onClick={() => this.onSave()}
//           className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           <Save size={16} />
//           Save
//         </button>
//         <button
//           onClick={() => this.onSubmit()}
//           className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           <Send size={16} />
//           Submit for Review
//         </button>
//       </div>
//     );
//   }

//   getStatusBadge() {
//     return (
//       <span className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded">Draft</span>
//     );
//   }
// }

// class ReviewState implements DocumentState {
//   constructor(private context: DocumentEditor) {}

//   onEdit() {
//     // Can't edit in review
//   }

//   onSave() {
//     // Can't save in review
//   }

//   onSubmit() {
//     // Already in review
//   }

//   onPublish() {
//     this.context.setState(new PublishedState(this.context));
//   }

//   onReject() {
//     this.context.setState(new DraftState(this.context));
//   }

//   getActions() {
//     return (
//       <div className="flex gap-2">
//         <button
//           onClick={() => this.onPublish()}
//           className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           <Check size={16} />
//           Approve & Publish
//         </button>
//         <button
//           onClick={() => this.onReject()}
//           className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
//         >
//           <Undo size={16} />
//           Reject
//         </button>
//       </div>
//     );
//   }

//   getStatusBadge() {
//     return (
//       <span className="px-2 py-1 text-sm bg-yellow-200 text-yellow-800 rounded">Under Review</span>
//     );
//   }
// }

// class PublishedState implements DocumentState {
//   constructor(private context: DocumentEditor) {}

//   onEdit() {
//     this.context.setState(new DraftState(this.context));
//   }

//   onSave() {
//     // Can't save when published
//   }

//   onSubmit() {
//     // Can't submit when published
//   }

//   onPublish() {
//     // Already published
//   }

//   onReject() {
//     // Can't reject when published
//   }

//   getActions() {
//     return (
//       <div className="flex gap-2">
//         <button
//           onClick={() => this.onEdit()}
//           className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           <Edit size={16} />
//           Edit New Draft
//         </button>
//         <button
//           className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
//         >
//           <Eye size={16} />
//           View Published
//         </button>
//       </div>
//     );
//   }

//   getStatusBadge() {
//     return (
//       <span className="px-2 py-1 text-sm bg-green-200 text-green-800 rounded">Published</span>
//     );
//   }
// }

// // Document Editor component (Context)
// const DocumentEditor = () => {
//   const [content, setContent] = useState("Start writing your document here...");
//   const [currentState, setCurrentState] = useState<DocumentState>(new DraftState({ setState: setCurrentState, saveContent: () => console.log("Saving content:", content) }));

//   return (
//     <div className="max-w-2xl mx-auto p-6 space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Document Editor</h1>
//         {currentState.getStatusBadge()}
//       </div>

//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />

//       <div className="flex justify-end">
//         {currentState.getActions()}
//       </div>
//     </div>
//   );
// };

// export default DocumentEditor;

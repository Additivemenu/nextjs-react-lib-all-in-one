/**
 * Modal Manager Module
 *
 * A complete modal management system with support for:
 * - Multiple stacked modals
 * - React hooks API (useModalManager)
 * - Backdrop click handling
 * - Escape key support
 * - Body scroll locking
 * - Portal-based rendering
 *
 * @example Basic Usage
 * ```tsx
 * import { Modal, ModalContent, useModalManager } from './modal-manager';
 *
 * function App() {
 *   return (
 *     <Modal>
 *       <MyComponent />
 *       <ModalContent id="my-modal">
 *         <div className="bg-white p-8 rounded-lg">
 *           <h2>My Modal</h2>
 *         </div>
 *       </ModalContent>
 *     </Modal>
 *   );
 * }
 *
 * function MyComponent() {
 *   const { openModal, closeModal } = useModalManager();
 *
 *   return (
 *     <>
 *       <button onClick={() => openModal('my-modal')}>
 *         Open Modal
 *       </button>
 *       <button onClick={() => closeModal('my-modal')}>
 *         Close Modal
 *       </button>
 *     </>
 *   );
 * }
 * ```
 *
 * @example Stacked Modals
 * ```tsx
 * function MyComponent() {
 *   const { openModal } = useModalManager();
 *
 *   return (
 *     <Modal>
 *       <ModalContent id="modal1">
 *         <div className="bg-white p-8 rounded-lg">
 *           <h2>First Modal</h2>
 *           <button onClick={() => openModal('modal2')}>
 *             Open Second Modal
 *           </button>
 *         </div>
 *       </ModalContent>
 *
 *       <ModalContent id="modal2">
 *         <div className="bg-white p-8 rounded-lg">
 *           <h2>Second Modal</h2>
 *           <p>This stacks on top of the first modal</p>
 *         </div>
 *       </ModalContent>
 *     </Modal>
 *   );
 * }
 * ```
 */

export { Modal } from "./Modal";
export { ModalContent } from "./ModalContent";
export { useModal } from "./ModalManagerContext";
export type { ModalManagerContextValue } from "./ModalManagerContext";

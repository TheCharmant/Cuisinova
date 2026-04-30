import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogBackdrop,
    Button,
} from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteDialogProps {
    isOpen: boolean
    recipeName: string
    closeDialog: () => void
    deleteRecipe: ()=> void
}
function DeleteDialog({ isOpen, closeDialog, recipeName, deleteRecipe }: DeleteDialogProps) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={closeDialog} className="relative z-modal-top">
            <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-5 border-2 border-red-200 bg-white p-6 sm:p-8 rounded-2xl shadow-2xl animate-fadeInUp">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
                            Delete &quot;{recipeName}&quot;?
                        </DialogTitle>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 ml-2">
                        This action cannot be undone. The recipe and all its associated data will be permanently removed.
                    </p>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-2.5 text-sm font-medium rounded-full border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                            onClick={closeDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-2.5 text-sm font-medium rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm hover:shadow-md transition-all"
                            onClick={deleteRecipe}
                        >
                            Yes, Delete Recipe
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default DeleteDialog

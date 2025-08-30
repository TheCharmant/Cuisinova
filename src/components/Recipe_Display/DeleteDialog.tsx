import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogBackdrop,
    Button,
} from '@headlessui/react';

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
            <DialogBackdrop className="fixed inset-0 bg-violet-900/80" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border border-violet-200 bg-white p-12 rounded-xl shadow-xl animate-fadeInUp">
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-brand-500 to-violet-600 bg-clip-text text-transparent">{`Permanently delete ${recipeName}?`}</DialogTitle>
                    <div className="flex gap-4 flex-end">
                        <Button className="bg-white border border-violet-200 text-violet-700 px-6 py-2 rounded-full shadow-md hover:bg-violet-50 hover:shadow-lg transition-all duration-300" onClick={closeDialog}>Cancel</Button>
                        <Button
                            className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 data-[disabled]:bg-gray-200"
                            onClick={deleteRecipe}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default DeleteDialog

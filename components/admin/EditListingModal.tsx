// components/admin/EditListingModal.tsx
'use client';

import AddListingModal from './AddListingModal';

interface EditListingModalProps {
  item: any;
  category: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditListingModal({ item, category, onClose, onSuccess }: EditListingModalProps) {
  return (
    <AddListingModal
      category={category}
      onClose={onClose}
      editItem={item}
      onSuccess={onSuccess}
    />
  );
}
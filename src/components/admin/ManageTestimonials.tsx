/** @format */

import React, { useMemo, useState } from "react";
import { useTestimonials, useCreateTestimonial, useDeleteTestimonial, useUpdateTestimonial } from "../../hooks/useTestimonials";
import { Testimonial } from "../../types";
import Modal from "../ui/Modal";
import { GenericForm } from "../forms/GenericFrom";
import * as yup from "yup";
import DeletionModal from "../ui/DeletionModal";

const TypedModal = Modal as unknown as React.FC<{ isOpen: boolean; onClose: () => void; title?: string; children?: React.ReactNode }>;

const ManageTestimonials: React.FC = () => {
  const { data, isLoading } = useTestimonials();
  const { mutate: createTestimonial, isPending: creating } = useCreateTestimonial();
  const { mutate: deleteTestimonial, isPending: deleting } = useDeleteTestimonial();
  const { mutate: updateTestimonial, isPending: updating } = useUpdateTestimonial();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null);
  const defaultValues = useMemo(() => ({
    name: editing?.name || "",
    email: editing?.email || "",
    message: editing?.message || "",
    image: editing?.image || "",
    rating: editing?.rating ?? 5,
    job: editing?.job || "",
    clinicName: editing?.clinicName || "",
  }), [editing]);

  const schema = useMemo(() => yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    message: yup.string().required("Message is required"),
    image: yup.string().url("Must be a valid URL").optional(),
    rating: yup.number().min(1).max(5).required(),
    job: yup.string().optional(),
    clinicName: yup.string().optional(),
  }), []);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (values: typeof defaultValues) => {
    if (editing?._id) {
      updateTestimonial({ id: editing._id, data: {
        name: values.name,
        email: values.email,
        message: values.message,
        image: values.image || undefined,
        rating: values.rating,
        job: values.job || undefined,
        clinicName: values.clinicName || undefined,
      }});
    } else {
      createTestimonial({
        name: values.name,
        email: values.email,
        message: values.message,
        image: values.image || undefined,
        rating: values.rating,
        job: values.job || undefined,
        clinicName: values.clinicName || undefined,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-xl shadow-sm p-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold mb-4'>Testimonials</h2>
          <button onClick={openCreate} className='px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700'>Add</button>
        </div>
        <TypedModal isOpen={isModalOpen} onClose={closeModal} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
          <GenericForm
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            schema={schema as any}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            defaultValues={defaultValues as any}
            onSubmit={handleSubmit}
            submitButtonText={editing ? (updating ? 'Updating...' : 'Update') : (creating ? 'Saving...' : 'Save')}
          />
        </TypedModal>
      </div>

      <div className='bg-white rounded-xl shadow-sm p-6'>
        <h2 className='text-xl font-bold mb-4'>Testimonials</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : !data || data.length === 0 ? (
          <p>No testimonials yet.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left text-sm'>
              <thead className='border-b font-medium'>
                <tr>
                  <th className='px-3 py-2'>Name</th>
                  <th className='px-3 py-2'>Email</th>
                  <th className='px-3 py-2'>Rating</th>
                  <th className='px-3 py-2'>Job</th>
                  <th className='px-3 py-2'>Clinic</th>
                  <th className='px-3 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((t: Testimonial) => (
                  <tr key={t._id} className='border-b'>
                    <td className='px-3 py-2'>{t.name}</td>
                    <td className='px-3 py-2'>{t.email}</td>
                    <td className='px-3 py-2'>{t.rating ?? '-'}</td>
                    <td className='px-3 py-2'>{t.job ?? '-'}</td>
                    <td className='px-3 py-2'>{t.clinicName ?? '-'}</td>
                    <td className='px-3 py-2'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => openEdit(t)}
                          className='px-3 py-1 bg-gray-200 text-gray-900 rounded hover:bg-gray-300'>
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDelete(t)}
                          disabled={deleting}
                          className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeletionModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete?._id) deleteTestimonial(confirmDelete._id);
          setConfirmDelete(null);
        }}
        title={'Delete Testimonial'}
        description={'This action cannot be undone.'}
        itemName={confirmDelete?.name || ''}
        itemDescription={confirmDelete?.message}
        isDeleting={deleting}
        type={'generic'}
      />
    </div>
  );
};

export default ManageTestimonials;



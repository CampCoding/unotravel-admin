import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../../Shared/Modal/Modal.jsx";
import ArticleForm from "../Form.jsx";
import Card from "../Card.jsx";
import LoadingGrid from "../../../Shared/States/LoadingGrid.jsx";
import EmptyState from "../../../Shared/States/EmptyState.jsx";
import ErrorState from "../../../Shared/States/ErrorState.jsx";
import { newsAPI } from "../../../api/endpoints.js";
import { useFetch } from "../../../hooks/useFetch.js";

export default function View() {
  const [editItem, setEditItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error, refetch } = useFetch(newsAPI.list);

  const handleAdd = () => { setEditItem(null); setOpenModal(true); };
  const handleEdit = (item) => { setEditItem(item); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setEditItem(null); };
  const handleSuccess = () => { refetch(); handleClose(); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try { await newsAPI.delete(id); refetch(); }
    catch { alert("Failed to delete article."); }
  };

  return (
    <section className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-700">All News</h2>
          <p className="text-xs text-gray-400 mt-0.5">{loading ? "Loading..." : `${data?.length ?? 0} articles total`}</p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blueMain text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all">
          <Icon icon="mdi:plus" width={16} /> Add Article
        </button>
      </div>

      {loading && <LoadingGrid count={8} />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (!data || data.length === 0) && (
        <EmptyState icon="fluent:news-24-regular" message="No articles yet" action={handleAdd} actionLabel="Add Article" />
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((article) => (
            <Card key={article.article_id || article.id} article={article} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <Modal open={openModal} onClose={handleClose} title={editItem ? "Edit Article" : "Add Article"} icon="fluent:news-24-regular">
        <ArticleForm initialData={editItem} onSuccess={handleSuccess} onClose={handleClose} />
      </Modal>
    </section>
  );
}

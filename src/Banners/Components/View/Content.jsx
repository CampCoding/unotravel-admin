import React from "react";
import Card from "../Card.jsx";
import LoadingGrid from "../../../Shared/States/LoadingGrid.jsx";
import EmptyState from "../../../Shared/States/EmptyState.jsx";
import ErrorState from "../../../Shared/States/ErrorState.jsx";

export default function Content({ data, loading, error, onDelete, onEdit, onRefetch, onAdd }) {
  return (
    <>
      {loading && <LoadingGrid count={8} />}
      {error && <ErrorState message={error} onRetry={onRefetch} />}
      {!loading && !error && (!data || data.length === 0) && (
        <EmptyState icon="mdi:images" message="No banners yet" action={onAdd} actionLabel="Add Banner" />
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((banner) => (
            <Card key={banner.banner_id || banner.id} banner={banner} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </>
  );
}

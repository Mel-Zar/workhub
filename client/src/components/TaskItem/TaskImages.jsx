import "./TaskImages.scss";

function TaskImages({
    oldImages,
    newImages,
    isEditing,
    onRemoveOld,
    onRemoveNew,
    onPreview,
    onDragStart,
    onDragOver,
    onNewImages,
}) {
    return (
        <section className="task-images">
            {oldImages.map((img, i) => (
                <div
                    key={img + i}
                    className="image-wrapper"
                    draggable={isEditing}
                    onDragStart={() => onDragStart("old", i)}
                    onDragOver={(e) => onDragOver("old", i, e)}
                >
                    <div className="img-inner">
                        <img
                            src={
                                img.startsWith("blob:")
                                    ? img
                                    : `${import.meta.env.VITE_API_URL}${img}`
                            }
                            alt=""
                            onClick={() =>
                                !isEditing &&
                                onPreview(
                                    img.startsWith("blob:")
                                        ? img
                                        : `${import.meta.env.VITE_API_URL}${img}`
                                )
                            }
                        />
                        {isEditing && (
                            <button
                                className="remove-btn"
                                onClick={() => onRemoveOld(img)}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {newImages.map((img, i) => (
                <div
                    key={img.preview}
                    className="image-wrapper"
                    draggable={isEditing}
                    onDragStart={() => onDragStart("new", i)}
                    onDragOver={(e) => onDragOver("new", i, e)}
                >
                    <div className="img-inner">
                        <img src={img.preview} alt="new" />
                        <button className="remove-btn" onClick={() => onRemoveNew(i)}>
                            ✕
                        </button>
                    </div>
                </div>
            ))}

            {isEditing && <input type="file" multiple onChange={onNewImages} />}
        </section>
    );
}

export default TaskImages;

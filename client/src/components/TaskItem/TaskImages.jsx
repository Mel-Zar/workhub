import { useState } from "react";
import "./TaskImages.scss";

function TaskImages({
    view = "grid",
    oldImages = [],
    newImages = [],
    isEditing,
    onRemoveOld,
    onRemoveNew,
    onPreview,
    onDragStart,
    onDragOver,
    onNewImages,
}) {

    const [index, setIndex] = useState(0);

    const allImages = [
        ...oldImages.map(img =>
            img.startsWith("blob:")
                ? img
                : `${import.meta.env.VITE_API_URL}${img}`
        ),
        ...newImages.map(img => img.preview)
    ];

    if (!allImages.length && !isEditing) return null;

    const next = (e) => {
        e.stopPropagation();
        setIndex(i => (i + 1) % allImages.length);
    };

    const prev = (e) => {
        e.stopPropagation();
        setIndex(i =>
            i === 0 ? allImages.length - 1 : i - 1
        );
    };

    /* =====================
       LIST VIEW = CAROUSEL
    ===================== */

    if (view === "list" && !isEditing) {

        return (

            <section className="task-images carousel">

                <button className="nav prev" onClick={prev}>
                    ‹
                </button>

                <img
                    src={allImages[index]}
                    onClick={() => onPreview(allImages[index])}
                />

                <button className="nav next" onClick={next}>
                    ›
                </button>

            </section>

        );

    }

    /* =====================
       GRID VIEW = THUMBNAILS
    ===================== */

    return (

        <section className="task-images">

            {oldImages.map((img, i) => {

                const src = img.startsWith("blob:")
                    ? img
                    : `${import.meta.env.VITE_API_URL}${img}`;

                return (
                    <div
                        key={`old-${i}`}
                        className="image-wrapper"
                        draggable={isEditing}
                        onDragStart={() => onDragStart("old", i)}
                        onDragOver={(e) => onDragOver("old", i, e)}
                    >

                        <img
                            src={src}
                            onClick={() => !isEditing && onPreview(src)}
                        />

                        {isEditing &&
                            <button
                                className="remove-btn"
                                onClick={() => onRemoveOld(img)}
                            >
                                ✕
                            </button>
                        }

                    </div>
                );

            })}


            {newImages.map((img, i) => (

                <div key={`new-${i}`} className="image-wrapper">

                    <img src={img.preview} />

                    {isEditing &&
                        <button
                            className="remove-btn"
                            onClick={() => onRemoveNew(i)}
                        >
                            ✕
                        </button>
                    }

                </div>

            ))}


            {isEditing &&

                <input
                    type="file"
                    multiple
                    onChange={onNewImages}
                />

            }

        </section>

    );

}

export default TaskImages;

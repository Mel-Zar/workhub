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


    /* LIST VIEW */

    if (view === "list" && !isEditing) {

        return (

            <section className="task-images carousel">

                <button
                    className="nav prev"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIndex(i =>
                            i === 0 ? allImages.length - 1 : i - 1
                        );
                    }}>
                    ‹
                </button>

                <img
                    src={allImages[index]}
                    onClick={() => onPreview(allImages[index])}
                />

                <button
                    className="nav next"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIndex(i =>
                            (i + 1) % allImages.length
                        );
                    }}>
                    ›
                </button>

            </section>

        );

    }


    /* GRID VIEW */

    return (

        <div className="task-images-block">

            <div className="task-images-container">

                <section className="task-images">


                    {/* OLD IMAGES */}

                    {oldImages.map((img, i) => {

                        const src =
                            img.startsWith("blob:")
                                ? img
                                : `${import.meta.env.VITE_API_URL}${img}`;

                        return (

                            <div
                                key={src}   // ✅ FIXED
                                className="image-wrapper"
                                draggable={isEditing}
                                onDragStart={() => onDragStart("old", i)}
                                onDragOver={(e) => onDragOver("old", i, e)}
                            >

                                <img
                                    src={src}
                                    onClick={() => !isEditing && onPreview(src)}
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

                        );

                    })}


                    {/* NEW IMAGES */}

                    {newImages.map((img, i) => (

                        <div
                            key={img.preview}   // ✅ CRITICAL FIX
                            className="image-wrapper"
                            draggable={isEditing}
                            onDragStart={() => onDragStart("new", i)}
                            onDragOver={(e) => onDragOver("new", i, e)}
                        >

                            <img src={img.preview} />

                            <button
                                className="remove-btn"
                                onClick={() => onRemoveNew(i)}
                            >
                                ✕
                            </button>

                        </div>

                    ))}


                </section>

            </div>


            {isEditing && (

                <label className="file-upload-row">

                    <input
                        type="file"
                        multiple
                        onChange={onNewImages}
                    />

                    <span>+ Add images</span>

                </label>

            )}

        </div>

    );

}

export default TaskImages;

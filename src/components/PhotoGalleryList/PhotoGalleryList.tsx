import Image from "next/image";
import { photoGalleryItems } from "@/data/photo-gallery";
import "./PhotoGalleryList.css";

export function PhotoGalleryList() {
  return (
    <ul className="photo-gallery-list">
      {photoGalleryItems.map((item, index) => (
        <li key={item.id} className="photo-gallery-item">
          <Image
            className="photo-gallery-image"
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(max-width: 39rem) 100vw, 39rem"
            priority={index < 3}
          />
        </li>
      ))}
    </ul>
  );
}

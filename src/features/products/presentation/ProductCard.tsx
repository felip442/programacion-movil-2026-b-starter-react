import { IonBadge, IonItem, IonLabel, IonNote } from '@ionic/react';

import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  /** Producto ya preparado para mostrarse (ver `toProductView`). */
  product: ProductView;
  /** Se invoca con el id del producto cuando la persona toca la tarjeta. */
  onSelect?: (id: number) => void;
}

/**
 * Tarjeta reutilizable de un producto (mismo estilo de props tipadas que `EmptyState`).
 * Solo muestra datos y avisa con `onSelect`; no sabe de dónde vienen.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const stockColor = product.isOutOfStock ? 'danger' : product.isLowStock ? 'warning' : 'success';

  return (
    <IonItem button detail onClick={() => onSelect?.(product.id)}>
      <IonLabel>
        <h2>{product.name}</h2>
        <p>{product.category}</p>
        <p>
          <strong>{product.priceLabel}</strong>
        </p>
      </IonLabel>
      <div slot="end" className="ion-text-end">
        <IonBadge color={stockColor}>{product.stockLabel}</IonBadge>
        <br />
        <IonNote>Stock: {product.stock}</IonNote>
      </div>
    </IonItem>
  );
};

export default ProductCard;

import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { deleteProduct, getProduct } from '../data/products-api';
import { toProductView, type ProductView } from '../domain/product';
import EmptyState from './EmptyState';

/**
 * Pantalla: detalle de un producto (ruta /productos/:id).
 * Carga con `getProduct`, maneja carga y error (incluido 404 «no encontrado»),
 * y ofrece Editar y Eliminar con una confirmación simple en pantalla.
 */
type LoadStatus = 'loading' | 'ready' | 'error';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const history = useHistory();

  const [product, setProduct] = useState<ProductView | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadProduct = useCallback(async () => {
    setStatus('loading');
    try {
      setProduct(toProductView(await getProduct(productId)));
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    }
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteProduct(productId);
      setIsConfirmingDelete(false);
      history.replace('/productos');
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>Detalle del producto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {status === 'loading' && <p>Cargando producto…</p>}

        {status === 'error' && (
          <EmptyState
            title="No se pudo mostrar el producto"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProduct()}
          />
        )}
        {status === 'error' && (
          <IonButton fill="clear" expand="block" routerLink="/productos">
            Volver a la lista
          </IonButton>
        )}

        {status === 'ready' && product && (
          <>
            <IonList>
              <IonItem>
                <IonLabel>
                  <p>Nombre</p>
                  <h2>{product.name}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Id</p>
                  <h2>{product.id}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Categoría</p>
                  <h2>{product.category}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Precio</p>
                  <h2>{product.priceLabel}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Stock</p>
                  <h2>{product.stock} unidades</h2>
                </IonLabel>
                <IonBadge
                  slot="end"
                  color={product.isOutOfStock ? 'danger' : product.isLowStock ? 'warning' : 'success'}
                >
                  {product.stockLabel}
                </IonBadge>
              </IonItem>
            </IonList>

            {!isConfirmingDelete && (
              <>
                <IonButton expand="block" routerLink={`/productos/${product.id}/editar`}>
                  Editar
                </IonButton>
                <IonButton expand="block" color="danger" onClick={() => setIsConfirmingDelete(true)}>
                  Eliminar
                </IonButton>
              </>
            )}

            {isConfirmingDelete && (
              <div className="ion-padding ion-text-center">
                <IonText color="danger">
                  <p>¿Eliminar este producto?</p>
                </IonText>
                <IonButton color="danger" disabled={isDeleting} onClick={() => void handleDelete()}>
                  {isDeleting ? 'Eliminando…' : 'Confirmar'}
                </IonButton>
                <IonButton fill="outline" disabled={isDeleting} onClick={() => setIsConfirmingDelete(false)}>
                  Cancelar
                </IonButton>
              </div>
            )}

            {deleteError && (
              <IonText color="danger">
                <p>{deleteError}</p>
              </IonText>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;

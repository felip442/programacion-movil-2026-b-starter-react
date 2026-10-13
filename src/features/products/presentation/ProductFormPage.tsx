import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ApiError, getErrorMessage } from '../data/api-error';
import { createProduct, getProduct, updateProduct } from '../data/products-api';
import { CATEGORIES, validateProduct, type ProductField, type ProductInput } from '../domain/product';
import EmptyState from './EmptyState';

/**
 * Pantalla: formulario de producto. Sirve para dos rutas:
 *  - /productos/nuevo        → crear
 *  - /productos/:id/editar   → editar (precarga los campos con `getProduct`)
 * Valida en línea con `validateProduct()` y muestra el mensaje y los `details` del servidor.
 */
type LoadStatus = 'loading' | 'ready' | 'error';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = id !== undefined;
  const productId = Number(id);
  const history = useHistory();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState<Partial<Record<ProductField, string>>>({});
  const [serverError, setServerError] = useState('');
  const [serverDetails, setServerDetails] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(isEditing ? 'loading' : 'ready');
  const [loadError, setLoadError] = useState('');

  const loadProduct = useCallback(async () => {
    if (!isEditing) return;
    setLoadStatus('loading');
    try {
      const product = await getProduct(productId);
      setName(product.name);
      setPrice(String(product.price));
      setCategory(product.category);
      setStock(String(product.stock));
      setLoadStatus('ready');
    } catch (error) {
      setLoadError(getErrorMessage(error));
      setLoadStatus('error');
    }
  }, [isEditing, productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  /** Convierte un texto del formulario en número; vacío → NaN para que la validación lo rechace. */
  const toNumber = (value: string): number => (value.trim() === '' ? Number.NaN : Number(value));

  const handleSave = async () => {
    const input: ProductInput = {
      name: name.trim(),
      price: toNumber(price),
      category,
      stock: toNumber(stock),
    };
    const validation = validateProduct(input);
    setErrors(validation.errors);
    setServerError('');
    setServerDetails([]);
    if (!validation.isValid) return;

    setIsSaving(true);
    try {
      if (isEditing) {
        await updateProduct(productId, input);
      } else {
        await createProduct(input);
      }
      history.replace('/productos');
    } catch (error) {
      setServerError(getErrorMessage(error));
      setServerDetails(error instanceof ApiError ? error.details : []);
    } finally {
      setIsSaving(false);
    }
  };

  const fieldError = (field: ProductField) =>
    errors[field] ? (
      <IonText color="danger">
        <small>{errors[field]}</small>
      </IonText>
    ) : null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>{isEditing ? 'Editar producto' : 'Nuevo producto'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loadStatus === 'loading' && <p>Cargando producto…</p>}

        {loadStatus === 'error' && (
          <EmptyState
            title="No se pudo cargar el producto"
            message={loadError}
            actionLabel="Volver a la lista"
            onAction={() => history.replace('/productos')}
          />
        )}

        {loadStatus === 'ready' && (
          <>
            <IonInput
              label="Nombre"
              labelPlacement="floating"
              fill="outline"
              maxlength={60}
              value={name}
              onIonInput={(event) => setName(String(event.detail.value ?? ''))}
            />
            {fieldError('name')}

            <IonInput
              className="ion-margin-top"
              label="Precio (COP)"
              labelPlacement="floating"
              fill="outline"
              type="number"
              inputmode="decimal"
              value={price}
              onIonInput={(event) => setPrice(String(event.detail.value ?? ''))}
            />
            {fieldError('price')}

            <div className="ion-margin-top">
              <IonLabel>Categoría</IonLabel>
              <div>
                {CATEGORIES.map((item) => (
                  <IonButton
                    key={item}
                    size="small"
                    fill={category === item ? 'solid' : 'outline'}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </IonButton>
                ))}
              </div>
              {fieldError('category')}
            </div>

            <IonInput
              className="ion-margin-top"
              label="Stock (unidades)"
              labelPlacement="floating"
              fill="outline"
              type="number"
              inputmode="numeric"
              value={stock}
              onIonInput={(event) => setStock(String(event.detail.value ?? ''))}
            />
            {fieldError('stock')}

            {serverError && (
              <IonText color="danger">
                <p>
                  <strong>{serverError}</strong>
                </p>
                {serverDetails.length > 0 && (
                  <ul>
                    {serverDetails.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
              </IonText>
            )}

            <IonButton className="ion-margin-top" expand="block" disabled={isSaving} onClick={() => void handleSave()}>
              {isSaving ? 'Guardando…' : 'Guardar'}
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;

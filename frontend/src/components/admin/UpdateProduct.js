import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";

export default function UpdateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [subcategory, setSubCategory] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);
    const [imagesPreview, setImagesPreview] = useState([]);
    
    // New properties
    const [brand, setBrand] = useState("");
    const [itemModelNum, setItemModelNum] = useState("");
    const [serialNum, setSerialNum] = useState("");
    const [connectionType, setConnectionType] = useState("");
    const [hardwarePlatform, setHardwarePlatform] = useState("");
    const [os, setOs] = useState("");
    const [powerConception, setPowerConception] = useState("");
    const [batteries, setBatteries] = useState("");
    const [packageDimension, setPackageDimension] = useState("");
    const [portDescription, setPortDescription] = useState("");
    const [connectivityType, setConnectivityType] = useState("");
    const [compatibleDevices, setCompatibleDevices] = useState("");
    const [powerSource, setPowerSource] = useState("");
    const [specialFeatures, setSpecialFeatures] = useState("");
    const [includedInThePackage, setIncludedInThePackage] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [itemSize, setItemSize] = useState("");
    const [itemWidth, setItemWidth] = useState("");

    const { id: productId } = useParams();
    const { loading, isProductUpdated, error, product } = useSelector(state => state.productState);

    const categories = [
        'NVR',
        'SMART HOME',
        'SENSORS',
        'CAMERA',
        'OTHERS'
    ];
    const subcategories = [
        'test1',
        'test2',
        'test3',
        'test13', 'test14', 'test15',
        'test22', 'test23', 'test24',
        'test25', 'test26', 'test27',
        'test28', 'test29', 'test30'
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, file]);
                }
            }
            reader.readAsDataURL(file);
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        formData.append('seller', seller);
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('brand', brand);
        formData.append('itemModelNum', itemModelNum);
        formData.append('serialNum', serialNum);
        formData.append('connectionType', connectionType);
        formData.append('hardwarePlatform', hardwarePlatform);
        formData.append('os', os);
        formData.append('powerConception', powerConception);
        formData.append('batteries', batteries);
        formData.append('packageDimension', packageDimension);
        formData.append('portDescription', portDescription);
        formData.append('connectivityType', connectivityType);
        formData.append('compatibleDevices', compatibleDevices);
        formData.append('powerSource', powerSource);
        formData.append('specialFeatures', specialFeatures);
        formData.append('includedInThePackage', includedInThePackage);
        formData.append('manufacturer', manufacturer);
        formData.append('itemSize', itemSize);
        formData.append('itemWidth', itemWidth);
        
        images.forEach(image => {
            formData.append('images', image);
        });
        formData.append('imagesCleared', imagesCleared);
        dispatch(updateProduct(productId, formData));
    };

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
        setImagesCleared(true);
    };

    useEffect(() => {
        if (isProductUpdated) {
            toast('Product Updated Successfully!', {
                type: 'success',
                onOpen: () => dispatch(clearProductUpdated())
            });
            setImages([]);
            return;
        }

        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            });
            return;
        }

        dispatch(getProduct(productId));
    }, [isProductUpdated, error, dispatch]);

    useEffect(() => {
        if (product._id) {
            setName(product.name);
            setPrice(product.price);
            setStock(product.stock);
            setDescription(product.description);
            setSeller(product.seller);
            setCategory(product.category);
            setSubCategory(product.subcategory);
            setBrand(product.brand);
            setItemModelNum(product.itemModelNum);
            setSerialNum(product.serialNum);
            setConnectionType(product.connectionType);
            setHardwarePlatform(product.hardwarePlatform);
            setOs(product.os);
            setPowerConception(product.powerConception);
            setBatteries(product.batteries);
            setPackageDimension(product.packageDimension);
            setPortDescription(product.portDescription);
            setConnectivityType(product.connectivityType);
            setCompatibleDevices(product.compatibleDevices);
            setPowerSource(product.powerSource);
            setSpecialFeatures(product.specialFeatures);
            setIncludedInThePackage(product.includedInThePackage);
            setManufacturer(product.manufacturer);
            setItemSize(product.itemSize);
            setItemWidth(product.itemWidth);

            let images = [];
            product.images.forEach(image => {
                images.push(image.image);
            });
            setImagesPreview(images);
        }
    }, [product]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                            <h1 className="mb-4">Update Product</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price_field">Price</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    onChange={e => setPrice(e.target.value)}
                                    value={price}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description_field">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description_field"
                                    rows="8"
                                    onChange={e => setDescription(e.target.value)}
                                    value={description}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category_field">Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)} className="form-control" id="category_field">
                                    <option value="">Select</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subcategory_field">Sub Category</label>
                                <select value={subcategory} onChange={e => setSubCategory(e.target.value)} className="form-control" id="subcategory_field">
                                    <option value="">Select</option>
                                    {subcategories.map(subcategory => (
                                        <option key={subcategory} value={subcategory}>{subcategory}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock_field">Stock</label>
                                <input
                                    type="number"
                                    id="stock_field"
                                    className="form-control"
                                    onChange={e => setStock(e.target.value)}
                                    value={stock}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="seller_field">Seller Name</label>
                                <input
                                    type="text"
                                    id="seller_field"
                                    className="form-control"
                                    onChange={e => setSeller(e.target.value)}
                                    value={seller}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="brand_field">Brand</label>
                                <input
                                    type="text"
                                    id="brand_field"
                                    className="form-control"
                                    onChange={e => setBrand(e.target.value)}
                                    value={brand}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="itemModelNum_field">Item Model Number</label>
                                <input
                                    type="text"
                                    id="itemModelNum_field"
                                    className="form-control"
                                    onChange={e => setItemModelNum(e.target.value)}
                                    value={itemModelNum}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="serialNum_field">Serial Number</label>
                                <input
                                    type="text"
                                    id="serialNum_field"
                                    className="form-control"
                                    onChange={e => setSerialNum(e.target.value)}
                                    value={serialNum}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="connectionType_field">Connection Type</label>
                                <input
                                    type="text"
                                    id="connectionType_field"
                                    className="form-control"
                                    onChange={e => setConnectionType(e.target.value)}
                                    value={connectionType}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hardwarePlatform_field">Hardware Platform</label>
                                <input
                                    type="text"
                                    id="hardwarePlatform_field"
                                    className="form-control"
                                    onChange={e => setHardwarePlatform(e.target.value)}
                                    value={hardwarePlatform}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="os_field">Operating System</label>
                                <input
                                    type="text"
                                    id="os_field"
                                    className="form-control"
                                    onChange={e => setOs(e.target.value)}
                                    value={os}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="powerConception_field">Power Conception</label>
                                <input
                                    type="text"
                                    id="powerConception_field"
                                    className="form-control"
                                    onChange={e => setPowerConception(e.target.value)}
                                    value={powerConception}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="batteries_field">Batteries</label>
                                <input
                                    type="text"
                                    id="batteries_field"
                                    className="form-control"
                                    onChange={e => setBatteries(e.target.value)}
                                    value={batteries}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="packageDimension_field">Package Dimension</label>
                                <input
                                    type="text"
                                    id="packageDimension_field"
                                    className="form-control"
                                    onChange={e => setPackageDimension(e.target.value)}
                                    value={packageDimension}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="portDescription_field">Port Description</label>
                                <input
                                    type="text"
                                    id="portDescription_field"
                                    className="form-control"
                                    onChange={e => setPortDescription(e.target.value)}
                                    value={portDescription}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="connectivityType_field">Connectivity Type</label>
                                <input
                                    type="text"
                                    id="connectivityType_field"
                                    className="form-control"
                                    onChange={e => setConnectivityType(e.target.value)}
                                    value={connectivityType}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="compatibleDevices_field">Compatible Devices</label>
                                <input
                                    type="text"
                                    id="compatibleDevices_field"
                                    className="form-control"
                                    onChange={e => setCompatibleDevices(e.target.value)}
                                    value={compatibleDevices}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="powerSource_field">Power Source</label>
                                <input
                                    type="text"
                                    id="powerSource_field"
                                    className="form-control"
                                    onChange={e => setPowerSource(e.target.value)}
                                    value={powerSource}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="specialFeatures_field">Special Features</label>
                                <input
                                    type="text"
                                    id="specialFeatures_field"
                                    className="form-control"
                                    onChange={e => setSpecialFeatures(e.target.value)}
                                    value={specialFeatures}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="includedInThePackage_field">Included in the Package</label>
                                <input
                                    type="text"
                                    id="includedInThePackage_field"
                                    className="form-control"
                                    onChange={e => setIncludedInThePackage(e.target.value)}
                                    value={includedInThePackage}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="manufacturer_field">Manufacturer</label>
                                <input
                                    type="text"
                                    id="manufacturer_field"
                                    className="form-control"
                                    onChange={e => setManufacturer(e.target.value)}
                                    value={manufacturer}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="itemSize_field">Item Size</label>
                                <input
                                    type="text"
                                    id="itemSize_field"
                                    className="form-control"
                                    onChange={e => setItemSize(e.target.value)}
                                    value={itemSize}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="itemWidth_field">Item Width</label>
                                <input
                                    type="text"
                                    id="itemWidth_field"
                                    className="form-control"
                                    onChange={e => setItemWidth(e.target.value)}
                                    value={itemWidth}
                                />
                            </div>

                            <div className='form-group'>
                                <label>Images</label>

                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        multiple
                                        onChange={onImagesChange}
                                    />

                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Images
                                    </label>
                                </div>

                                {imagesPreview.length > 0 && (
                                    <span
                                        className="mr-2"
                                        onClick={clearImagesHandler}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </span>
                                )}
                                {imagesPreview.map(image => (
                                    <img
                                        className="mt-3 mr-2"
                                        key={image}
                                        src={image}
                                        alt={`Image Preview`}
                                        width="55"
                                        height="52"
                                    />
                                ))}
                            </div>

                            <button
                                id="login_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3"
                            >
                                UPDATE
                            </button>

                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    );
}


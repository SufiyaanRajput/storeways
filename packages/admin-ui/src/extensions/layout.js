import {
  OrdersListPage,
  CategoriesListPage,
  VariationsListPage,
  ProductsListPage,
  AddEditProductPage,
  StoreSettingsPage,
  HomeLayoutPage,
  FooterLayoutPage,
} from "../pages";
import {
  faShoppingBag,
  faSitemap,
  faBarcode,
  faStore,
  faSwatchbook,
  faTh,
} from "@fortawesome/free-solid-svg-icons";

const extensions = [
  {
    id: "orders",
    title: "Orders",
    path: "/orders",
    icon: faShoppingBag,
    default: true,
    component: OrdersListPage,
  },
  {
    id: "categories",
    title: "Categories",
    path: "/categories",
    icon: faSitemap,
    component: CategoriesListPage,
  },
  {
    id: "products",
    title: "Products",
    path: "/products",
    icon: faBarcode,
    component: ProductsListPage,
    routes: [
      { path: "/products/create", component: AddEditProductPage },
      { path: "/products/:id", component: AddEditProductPage },
    ],
  },
  {
    id: "variations",
    title: "Variations",
    path: "/variations",
    icon: faSwatchbook,
    component: VariationsListPage,
  },
  {
    id: "store",
    title: "Store",
    path: "/store",
    icon: faStore,
    component: StoreSettingsPage,
  },
  {
    id: "layout",
    title: "Layout",
    icon: faTh,
    children: [
      {
        id: "home",
        title: "Home",
        path: "/layout/home",
        component: HomeLayoutPage,
      },
      {
        id: "footer",
        title: "Footer",
        path: "/layout/footer",
        component: FooterLayoutPage,
      },
    ],
  },
];

export const registerLayoutExtension = (extension = []) => {
  extensions.push(...extension);
};

export const getLayoutExtensions = () => {
  return extensions;
};
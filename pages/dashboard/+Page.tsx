import { Button } from "@mantine/core";
import { getProducts } from "../../funtions/getProducts.telefunc";

function Dashboard() {
  return <div>Dashboard
    <Button onClick={() => getProducts().then((products) => console.log(products))}>Get Products</Button>
  </div>;
}

export default Dashboard;
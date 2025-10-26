export const FoodCategories = [
    "Beverages",
    "Kottu",
    "Fried Rice",
    "Pizza",
    "Burger"
]

export const getFoodImageUrl =  (foodCategory) => {
    switch (foodCategory) {
        case "Beverages":
            return `/foods/beverages.jpg`;
        case "Kottu":
            return `/foods/kottu.jpg`;
        case "Fried Rice":
            return `/foods/fried-rice.jpg`;
        case "Pizza":
            return `/foods/pizza.jpg`;
        case "Burger":
            return `/foods/burger.jpg`;
        default:
            return `/default/default-food.jpg`;
    }
}
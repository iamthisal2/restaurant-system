import React, {use, useEffect, useState} from "react";
import * as foodService from "../services/food.service";
import FoodItem from "../components/FoodItem";
import * as foodTagService from "../services/foodTag.service.js";

import {useAuth} from "../Context/AuthContext.jsx";


const Menu = () => {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const {currentUser} = useAuth();
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [userFoodTags, setUserFoodsTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await foodService.getAllFoods();
                if (response && response.data) {
                    setFoods(response.data);
                    setFilteredFoods(response.data);

                    const uniqueCategories = [
                        ...new Set(response.data.map(f => f.category))
                    ];
                    setCategories(uniqueCategories);
                }
            } catch (err) {
                console.error('Error fetching foods:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, []);

    const fetchTags = async () => {
        if(!currentUser) return;
        setLoading(true);
        try {
            const response = await foodTagService.getFoodTagsForUser(currentUser?.id);
            if (response && response.data) {
                setUserFoodsTags(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch tags:", err);
        } finally {
            setLoading(false);
        }
    };

    const filterCategory = (category) => {
        setActiveCategory(category);
        if (category === "all") {
            setFilteredFoods(foods);
        } else {
            setFilteredFoods(foods.filter(f => f.category === category));
        }
    };

    const filterByTag = (tagName) => {
        setActiveCategory(tagName);
        setFilteredFoods(foods.filter(f => f.category === tagName));
    };

    useEffect(() => {
        fetchTags().then()
    }, [currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading menu...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Explore Our Menu
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our delicious selection of freshly prepared dishes, made with the finest ingredients just for you.
                    </p>
                </div>

                {/* User Food Tags Section */}
                {currentUser && userFoodTags.length > 0 && (
                    <div className="mb-8">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Favorite Categories</h3>
                            <p className="text-gray-500 text-sm">Click on your tags to filter the menu</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {userFoodTags.map((tag, idx) => (
                                <button
                                    key={idx}
                                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 border ${
                                        activeCategory === tag?.tag
                                            ? "bg-blue-500 text-white border-blue-500 shadow-md"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-500"
                                    }`}
                                    onClick={() => filterByTag(tag?.tag)}
                                >
                                    {tag.tag}
                                </button>
                            ))}
                            <button
                                className="px-4 py-2 rounded-full font-medium text-gray-500 border border-gray-300 hover:border-gray-400 hover:text-gray-600 transition-all duration-200"
                                onClick={() => filterCategory("all")}
                            >
                                Clear Tags
                            </button>
                        </div>
                    </div>
                )}

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <button
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 border-2 ${
                            activeCategory === "all"
                                ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                                : "bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-500"
                        }`}
                        onClick={() => filterCategory("all")}
                    >
                        All Items
                    </button>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 border-2 ${
                                activeCategory === cat
                                    ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-500"
                            }`}
                            onClick={() => filterCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Food Items Grid */}
                {filteredFoods.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No items found</h3>
                        <p className="text-gray-500">We couldn't find any items in this category.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredFoods.map(food => (
                            <FoodItem key={food.id} food={food} />
                        ))}
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-orange-500">{filteredFoods.length}</span>{" "}
                        {filteredFoods.length === 1 ? "item" : "items"}
                        {activeCategory !== "all" && (
                            <span> in <span className="font-semibold text-orange-500">{activeCategory}</span></span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Menu;
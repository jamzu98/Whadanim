import React from 'react';

export const searchAnime = async (query) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const randomSearch = async () => {
  let animeFound = false;
  while (!animeFound) {
    try {
      const randomId = Math.floor(Math.random() * 50000) + 1;
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${randomId}`
      );
      const data = await response.json();

      if (data && data.data && data.data.title) {
        animeFound = true;
        return data.data.title;
      }
    } catch (error) {
      console.error(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
};

export const showRecommendations = async (id) => {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${id}/recommendations`
    );
    const data = await response.json();
    const newArr = data.data.map((x) => x.entry).slice(0, 10);
    return newArr;
  } catch (error) {
    console.error(error);
    return [];
  }
};

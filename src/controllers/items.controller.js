const https = require("https");
const axios = require("axios");

const items_controller = {
  getAll: async (req, res, next) => {
    try {
      const searchQuery = req.query[0];
      const queryLimit = 4;

      const response = await axios(
        `https://api.mercadolibre.com/sites/MLA/search?q=${searchQuery}&limit=${queryLimit}`
      );
      const itemsList = response.data.results;
      const categoryList = response.data.filters;

      let allItemsData = {
        author: {
          name: "Maiten",
          lastname: "Peinetti",
        },
        categories: [],
        items: [],
      };

      itemsList.map((item) => {
        allItemsData.categories.push(item.category_id);
        allItemsData.items.push({
          id: item.id,
          title: item.title,
          price: {
            currency: item.prices.prices[0].currency_id,
            amount: item.prices.prices[0].amount.toString().split(".").shift(),
            decimals:
              item.prices.prices[0].amount.toString().split(".").length > 1
                ? item.prices.prices[0].amount.toString().split(".").pop()
                : "00",
          },
          picture: item.thumbnail,
          condition: item.condition,
          free_shipping: item.shipping.free_shipping,
          seller_address: item.seller_address.state.name,
        });
      });
      res.status(200).send({ allItemsData, categoryList });
    } catch (err) {
      console.log(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      let idSearchQuery = req.params.id;
      const response = await axios(
        `https://api.mercadolibre.com/items/${idSearchQuery}`
      );
      const description = await axios(
        `https://api.mercadolibre.com/items/${idSearchQuery}/description`
      );

      const oneItem = response.data;

      let oneItemsData = {
        author: {
          name: "Maiten",
          lastname: "Peinetti",
        },
        items: {
          id: oneItem.id,
          title: oneItem.title,
          price: {
            currency: oneItem.currency_id,
            amount: oneItem.price.toString().split(".").shift(),
            decimals:
              oneItem.price.toString().split(".").length > 1
                ? oneItem.price.toString().split(".").pop()
                : "00",
          },
          picture: [],
          condition: oneItem.condition,
          free_shipping: oneItem.shipping.free_shipping,
          seller_address: oneItem.seller_address.state.name,
          sold_quantity: oneItem.sold_quantity,
          description: description.data.plain_text,
        },
      };
      response.data.pictures.map((img) => {
        oneItemsData.items.picture.push(img.url);
      });

      res.status(200).send(oneItemsData);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = items_controller;

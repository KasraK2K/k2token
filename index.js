// default modules
const shortid = require("shortid");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");

/**
 * @type {*} create sequelize database in file
 * comment this if you wish save data in memory
 */
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "shorterurl-database/database.sqlite",
  logging: false,
});

/**
 * @type {*} create sequelize database in memory
 * uncomment this if you wish save data in memory
 */
// const sequelize = new Sequelize("sqlite::memory:", { logging: false });

const short_id = shortid.generate();

class ShortUrl extends Model {}

ShortUrl.init(
  {
    short_url: DataTypes.STRING,
    original_url: DataTypes.STRING,
  },
  { sequelize, modelName: "urls" }
);

/**
 * @param {*} original this parameter is your original url as string
 * @return {*} string we call that short_url
 */
const getShortUrl = async (original) => {
  await sequelize.sync();
  const url = await ShortUrl.create({
    short_url: short_id,
    original_url: original,
  });
  return url.toJSON().short_url;
};

/**
 * @param {*} short_url this parameter is returned when using getShortUrl()
 * @return {*} original url as string
 */
const getOriginalUrl = async (short_url) => {
  try {
    const url = await ShortUrl.findOne({
      where: {
        short_url,
        /**
         * 
         * uncomment and change this if you need to filter result
         * 
          createdAt: {
            [Op.lt]: new Date(),
            [Op.gt]: new Date(new Date() - 5 * 60 * 60 * 1000),
          },
         */
      },
    });
    if (url) return url.original_url;
    else return undefined;
  } catch (error) {
    throw new Error(`error on get url: ${short_url}`);
  }
};

const purge = async (timestamp) => {
  try {
    ShortUrl.destroy({
      where: {
        createdAt: {
          [Op.lt]: new Date(timestamp),
        },
      },
    });
  } catch (error) {
    throw new Error(`error on purge data: ${error.message}`);
  }
};

module.exports.getShortUrl = getShortUrl;
module.exports.getOriginalUrl = getOriginalUrl;

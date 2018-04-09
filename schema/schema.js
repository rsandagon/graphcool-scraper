import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema
} from 'graphql';
import axios from 'axios';
import cheerio from 'cheerio';

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: {
        author: { type: GraphQLString },
        title: { type: GraphQLString },
        url: { type: GraphQLString }
    },
})

const ArticleBodyType = new GraphQLObjectType({
    name: 'ArticleBody',
    fields: {
        body: { type: GraphQLString }
    },
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        articles: {
            type: new GraphQLList(ArticleType),
            resolve() {
                return axios.get('https://dev.to/t/react/top/week')
                    .then((response) => {
                        if (response.status === 200) {
                            const html = response.data;
                            const $ = cheerio.load(html);
                            let devtoList = [];
                            $('.single-article').each(function (i, elem) {
                                devtoList[i] = {
                                    title: $(this).find('h3').text().trim(),
                                    url: $(this).children('.index-article-link').attr('href'),
                                    author: $(this).find('h4 > a').text()
                                }
                            });

                            return devtoList;
                        }
                    }, (error) => console.log(err));

            }
        },
        article: {
            type: ArticleBodyType,
            args: { url: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`https://dev.to${args.url}`)
                    .then(response => {
                        if (response.status === 200) {
                            const html = response.data;
                            const $ = cheerio.load(html);
                            let articleBody = {
                                body: $('.body'),
                            }

                            return articleBody;
                        }
                    })
            }
        }
    }
})

export default new GraphQLSchema({
    query: RootQuery
})
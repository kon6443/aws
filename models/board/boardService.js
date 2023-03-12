// boardService.js

class boardService {
    #REQUEST_URL
    constructor(container) {
        const config = container.get('config');
        this.#REQUEST_URL = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id='+config.KAKAO.REST_API_KEY+'&redirect_uri='+config.KAKAO.REDIRECT_URI; 
        this.repository = container.get('MySQLRepository');
    }

    convertDateFormat(date) {
        date = date.toLocaleString('default', {year:'numeric', month:'2-digit', day:'2-digit'});
        let year = date.substr(6,4);
        let month = date.substr(0,2);
        let day = date.substr(3,2);
        let convertedDate = `${year}-${month}-${day}`;
        return convertedDate;
    }
    
    convertTableDateFormat(table) {
        for(let i=0;i<table.length;i++) {
            table[i].POST_DATE = this.convertDateFormat(table[i].POST_DATE);
            table[i].UPDATE_DATE = this.convertDateFormat(table[i].UPDATE_DATE);
        }
        return table;
    }
    
    convertArticleDateFormat(article) {
        article.POST_DATE = this.convertDateFormat(article.POST_DATE);
        article.UPDATE_DATE = this.convertDateFormat(article.UPDATE_DATE);
        return article;
    }
    
    async getTitlesIncludeString(titles, search) {
        let result = [];
        for(let i=0;i<titles.length;i++) {
            if(titles[i].TITLE.includes(search)) result.push(titles[i]);
        }
        return result;
    }
    converToNumber(number, defaultValue) {
        // Ensuring that the variable value is an integer greater than or equal to 1.
        number = Math.max(1, parseInt(number)); 
        // Making sure that the number is always a number, and if it's not, it defaults to 1.
        number = !isNaN(number) ? number:defaultValue; 
        return number;
    }
    async getPageItems(totalItems, currentPage, itemsPerPage) {
        currentPage = this.converToNumber(currentPage, 1);
        itemsPerPage = this.converToNumber(itemsPerPage, 10);
    
        const totalPages = Math.ceil(totalItems/itemsPerPage);
        const startIndex = (currentPage-1) * itemsPerPage;
        const endIndex = (currentPage===totalPages) ? totalItems-1 : (currentPage*itemsPerPage-1);
        return {
            currentPage: currentPage,
            itemsPerPage: itemsPerPage,
            totalPages: totalPages,
            startIndex: startIndex,
            endIndex: endIndex
        };
    }

    /**
     * ArticlesService
     */
    async getAllArticles() {
        const sql = `SELECT * FROM BOARD ORDER BY BOARD_NO DESC;`;
        let [articles] = await this.repository.executeQuery(sql);
        articles = this.convertTableDateFormat(articles);
        return articles;
    }

    async searchArticlesByTitle(title) {
        const sql = `SELECT * FROM BOARD WHERE TITLE LIKE '%${title}%' ORDER BY BOARD_NO DESC;`;
        let [articles] = await this.repository.executeQuery(sql);
        articles = this.convertTableDateFormat(articles);
        return articles;
    }

    async searchTitleByChar(keyStroke) {
        const sql = `SELECT TITLE FROM BOARD WHERE TITLE LIKE '%${keyStroke}%' ORDER BY BOARD_NO DESC;`;
        let [titles] = await this.repository.executeQuery(sql);
        return titles;
    }

    async showArticleByNum(article_num) {
        const sql = `SELECT * FROM BOARD WHERE BOARD_NO=${article_num};`;
        let [article] = await this.repository.executeQuery(sql);
        article = this.convertArticleDateFormat(article[0]);
        return article;
    }

    async insert(title, content, author) {
        const sql = `INSERT INTO BOARD (TITLE, content, POST_DATE, UPDATE_DATE, AUTHOR) VALUES ?;`;
        const date_obj = new Date();
        const post_date = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate();
        const update_date = post_date;
        let values = [
            [title, content, post_date, update_date, author]
        ];
        const [res] = await this.repository.executeQuery(sql, [values]);
        return res.affectedRows;
    }

    async deleteByNum(article_num) {
        const sql = `DELETE FROM BOARD WHERE BOARD_NO=${article_num};`;
        const [res] = await this.repository.executeQuery(sql);
        return res.affectedRows;
    }

    async editArticle(article_num, title, content, update) {
        const sql = `UPDATE BOARD SET TITLE=${title}, content=${content}, UPDATE_DATE=${update} WHERE BOARD_NO=${article_num};`;
        return await this.repository.executeQuery(sql);
    }

    /**
     * CommentService
     */

    async getMaxCommentOrder(article_num, group_num) {
        const sql = `SELECT MAX(comment_order) AS maxCommentOrder FROM comment WHERE article_num=${article_num} AND group_num=${group_num};`;
        const [[res]] = await this.repository.executeQuery(sql);
        res.maxCommentOrder ??= 0;
        return res.maxCommentOrder;
    }
    
    async getNewGroupNum(article_num) {
        const sql = `SELECT MAX(comment.group_num) AS maxGroupNum FROM BOARD LEFT JOIN comment ON BOARD.BOARD_NO=comment.article_num WHERE BOARD.BOARD_NO=${article_num};`;
        const [[res]] = await this.repository.executeQuery(sql);
        res.maxGroupNum ??= 0;
        return res.maxGroupNum+1;
    }
    
    getTime() {
        const date_obj = new Date();
        let date = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate()+" ";
        let time = date_obj.getHours() +":"+ date_obj.getMinutes() +":"+ date_obj.getSeconds();
        time = date+time;
        return time;
    }
    
    async getComments(article_num) {
        // const sql = "SELECT * FROM COMMENT WHERE article_num='"+article_num+"';";
        const sql = `SELECT * FROM comment WHERE article_num=${article_num} ORDER BY group_num, comment_order ASC;`
        let [comments] = await this.repository.executeQuery(sql);
        return comments
    }
    
    async insertComment(article_num, author, content, length) {
        // insert into comment (article_num, author, time, class, comment_order, group_num, content) VALUES (24, 'prac', '2022-09-02', 1, 1, 1, 'this is a comment content');
        const sql = `INSERT INTO comment (article_num, author, time, class, comment_order, group_num, content) VALUES ?;`;
        const time = this.getTime();
        const depth = 0;
        const new_group = await this.getNewGroupNum(article_num);
        // const comment_order = parseInt(length) + 1;
        const comment_order = await this.getMaxCommentOrder(article_num, new_group) + 1;
        let values = [
            [article_num, author, time, depth, comment_order, new_group, content]
        ];
        const [res] = await this.repository.executeQuery(sql, [values]);
        return res.affectedRows;
    }
    
    async editCommentByNum(comment_num, content) {
        const query = `UPDATE comment SET content='${content}' WHERE comment_num=${comment_num};`
        const [res] = await this.repository.executeQuery(query);
        return res.affectedRows;
    }
    
    async insertReply(article_num, author, group_num, content) {
        const sql = `INSERT INTO comment (article_num, author, time, class, comment_order, group_num, content) VALUES ?;`;
        const time = this.getTime();
        const depth = 1;
        const comment_order = await this.getMaxCommentOrder(article_num, group_num) + 1;
        let values = [
            [article_num, author, time, depth, comment_order, group_num, content]
        ];
        const [res] = await this.repository.executeQuery(sql, [values]);
        return res.affectedRows;
    }
    
    async getCommentAuthorByNum(comment_num) {
        const sql = `SELECT author FROM comment WHERE comment_num=${comment_num};`;
        const [[commentAuthor]] = await this.repository.executeQuery(sql);
        return commentAuthor.author;
    }
    
    async deleteComment(comment_num) {
        const sql = `UPDATE comment SET author='deleted', content='deleted', time=NULL WHERE comment_num=${comment_num};`;
        const [res] = await this.repository.executeQuery(sql);
        return res.affectedRows;
    }
}

module.exports = boardService;

/**
 * ====== Methods ===========================================================================================================
 */

exports.convertDateFormat = (date) => {
    date = date.toLocaleString('default', {year:'numeric', month:'2-digit', day:'2-digit'});
    let year = date.substr(6,4);
    let month = date.substr(0,2);
    let day = date.substr(3,2);
    let convertedDate = `${year}-${month}-${day}`;
    return convertedDate;
}

exports.convertTableDateFormat = (table) => {
    for(let i=0;i<table.length;i++) {
        table[i].POST_DATE = this.convertDateFormat(table[i].POST_DATE);
        table[i].UPDATE_DATE = this.convertDateFormat(table[i].UPDATE_DATE);
    }
    return table;
}

exports.convertArticleDateFormat = (article) => {
    article.POST_DATE = this.convertDateFormat(article.POST_DATE);
    article.UPDATE_DATE = this.convertDateFormat(article.UPDATE_DATE);
    return article;
}

exports.getTitlesIncludeString = async (titles, search) => {
    let result = [];
    for(let i=0;i<titles.length;i++) {
        if(titles[i].includes(search)) result.push(titles[i]);
    }
    return result;
}

 exports.getPageItems = async (articles_length, page, limit) => {
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));
    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;
    let last_page = Math.ceil(articles_length/limit);
    const obj = {
        page: page, 
        limit: limit,
        last_page: last_page,
        range_min: (page-1)*limit, 
        range_max: (page === last_page) ? (articles_length) : (page*limit)
    }
    return obj;
}

/**
 * ===============================================================================================================================
 */

var request_url = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id='+process.env.REST_API_KEY+'&redirect_uri='+process.env.REDIRECT_URI;

/** 
// Main login page.
exports.showMain = async (req, res, next) => {
    if(req.query.search) return next();
    let { search, page, limit } = req.query;
    let articles = await boardDAO.getAllTables();
    articles = this.convertTableDateFormat(articles);
    const boardObject = await this.getPageItems(articles.length, page, limit);
    return res.render(path.join(__dirname, '../../views/board/board'), {
        articles: articles, 
        user: (req.decoded) ? (req.decoded.id) : ('Guest'),
        page_current: boardObject.page, 
        last_page: boardObject.last_page, 
        length: articles.length, 
        limit: boardObject.limit, 
        range_min: boardObject.range_min,
        range_max: boardObject.range_max,
        search: search
    });
}

exports.searchByTitle = async (req, res) => {
    let { search, page, limit } = req.query;
    let articles = await boardDAO.getMatchingArticles(search);
    articles = this.convertTableDateFormat(articles);
    if(articles.length === 0) {
        return res.send("<script>alert('No matching article.'); window.location.href = '/board';</script>");
    }
    const boardObject = await this.getPageItems(articles.length, page, limit);
    return res.render(path.join(__dirname, '../../views/board/board'), {
        articles: articles,
        user: (req.decoded) ? (req.decoded.id) : ('Guest'),
        page_current: boardObject.page,
        last_page: boardObject.last_page, 
        length: articles.length, 
        limit: boardObject.limit, 
        range_min: boardObject.range_min,
        range_max: boardObject.range_max,
        search: search
    });
}

exports.showPost = async (req, res, next) => {
    if(req.query.keyStroke) return next();
    if(req.query.search) return next();
    const user = req.decoded;
    if(user) {
        const article_num = req.params.id;
        let article = await boardDAO.showArticleByNum(article_num);
        article = this.convertArticleDateFormat(article);
        let comments = await boardCommentDAO.getComments(article_num);
        return res.render(path.join(__dirname, '../../views/board/article'), {user:user, article: article, comments: comments, length: comments.length});
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'), {request_url:request_url});
    }
}

exports.postComment = async (req, res) => {
    const user = req.decoded;
    if(user) {
        const {content, article_num, length} = req.body;
        await boardCommentDAO.insertComment(article_num, user.id, content, length);
        return res.status(200).send('Comment has been posted.');
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'), {request_url:request_url});
    }
}

exports.editComment = async (req, res) => {
    const user = req.decoded.id;
    const { comment_num, content } = req.body;
    const commentAuthor = await boardCommentDAO.getCommentAuthorByNum(comment_num);
    if(user === commentAuthor) {
        await boardCommentDAO.editCommentByNum(comment_num, content);
        return res.status(200).send('Comment has been updated.').end();
    } else {
        return res.status(200).send('Account not matched.').end();
    }
}

exports.postReply = async (req, res) => {
    const author = req.decoded.id;
    if(author) {
        const { article_num, group_num, content } = req.body;
        await boardCommentDAO.insertReply(article_num, author, group_num, content);
        return res.status(200).send('Reply has been posted.');
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'), {request_url:request_url});
    }
}

exports.autoComplete = async (req, res, next) => {
    if(req.query.search) return next();
    const keyStroke = req.query.keyStroke;
    const titles = await boardDAO.getAllTitles();
    const result = await this.getTitlesIncludeString(titles, keyStroke);
    return res.status(200).send(result).end();
}

// Writing page.
exports.boardWrite = (req, res) => {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../../views/board/boardWrite'), {user:user});
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'), {request_url:request_url});
    }
}

exports.insertArticle = async (req, res) => {
    const user = req.decoded;
    const { title, content } = req.body;
    if(user) {
        const author = user.id;
        await boardDAO.insert(title, content, author);
        return res.status(200).send('Article has been posted.').end(); 
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'), {request_url:request_url});
    }
}

exports.deleteArticle = async (req, res, next) => {
    if(req.body.comment_num) return next();
    const user = req.decoded;
    const { article_num } = req.body;
    let article = await boardDAO.showArticleByNum(article_num);
    article = this.convertArticleDateFormat(article);
    if(user.id === article.AUTHOR) {
        await boardDAO.deleteByNum(article_num);
        return res.status(200).send('Article has been removed.').end(); 
    } else {
        return res.status(200).send('Account not matched.').end();
    }
}

exports.deleteComment = async (req, res) => {
    const user = req.decoded.id;
    const { comment_num } = req.body;
    const commentAuthor = await boardCommentDAO.getCommentAuthorByNum(comment_num);
    if(user === commentAuthor) {
        await boardCommentDAO.deleteComment(comment_num);
        return res.status(200).send('Comment has been removed.').end();
    } else {
        return res.status(200).send('Account not matched.').end();
    }
}

exports.editArticle = async (req, res) => {
    const user = req.decoded;
    const article_num = req.params.id;
    let article = await boardDAO.showArticleByNum(article_num);
    article = convertArticleDateFormat(article);
    if(user.id === article.AUTHOR) {
        return res.render(path.join(__dirname, '../../views/board/editArticle'), {user:user, article:article});
    }
}

exports.submitEditedArticle = async (req, res) => {
    const user = req.decoded;
    const article_num = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    let article = await boardDAO.showArticleByNum(article_num);
    article = convertArticleDateFormat(article);
    const date_obj = new Date();
    article.UPDATE_DATE = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate();
    await boardDAO.editArticle(article_num, title, content, article.UPDATE_DATE);
    return res.status(200).send('Your article has been editied.');
}

exports.errorHandler = (err, req, res, next) => {
    if(err.message==='Invalid user') {
        res.render(path.join(__dirname, '../../views/board/board'));
    }
}

*/
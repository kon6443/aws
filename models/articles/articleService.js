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
    convertToNumber(number, defaultValue) {
        // Ensuring that the variable value is an integer greater than or equal to 1.
        number = Math.max(1, parseInt(number)); 
        // Making sure that the number is always a number, and if it's not, it defaults to 1.
        number = !isNaN(number) ? number:defaultValue; 
        return number;
    }

    async getMatchingTitleCount(key) {
        // const sql = `SELECT COUNT(TITLE) AS matchingTitleCount FROM BOARD WHERE MATCH(TITLE) AGAINST(? IN NATURAL LANGUAGE MODE);`;
        key ??= '';
        const sql = `SELECT COUNT(TITLE) AS matchingTitleCount FROM BOARD WHERE TITLE LIKE ?;`;
        const values = [`%${key}%`];
        const [[res]] = await this.repository.executeQuery(sql, values);
        return res.matchingTitleCount;
    }

    async getPageItems(totalItems, currentPage, itemsPerPage) {
        currentPage = this.convertToNumber(currentPage, 1);
        itemsPerPage = this.convertToNumber(itemsPerPage, 10);

        const totalPages = Math.ceil(totalItems/itemsPerPage);
        currentPage = currentPage>totalPages ? 1 : currentPage;
        const startIndex = (currentPage-1) * itemsPerPage;
        const endIndex = (currentPage===totalPages) ? totalItems-1 : (currentPage*itemsPerPage-1);
        return {
            currentPage,
            itemsPerPage,
            totalPages,
            startIndex,
            endIndex
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

    async searchArticlesByTitle(title, startIndex, endIndex) {
        title ??= '';
        const sql = `SELECT * FROM BOARD WHERE TITLE LIKE ? ORDER BY BOARD_NO DESC LIMIT ? OFFSET ?;`;
        const LIMIT = endIndex-startIndex+1
        const OFFSET = startIndex===0 ? 0 : startIndex;
        const values = [`%${title}%`, LIMIT, OFFSET];
        let [articles] = await this.repository.executeQuery(sql, values);
        articles = this.convertTableDateFormat(articles);
        return articles;
    }

    async searchTitleByChar(keyStroke) {
        const sql = `SELECT TITLE FROM BOARD WHERE TITLE LIKE ? ORDER BY BOARD_NO DESC;`;
        const values = [`%${keyStroke}%`];
        let [titles] = await this.repository.executeQuery(sql, values);
        return titles;
    }

    async getArticleById(id) {
        const sql = `SELECT * FROM BOARD WHERE BOARD_NO=?;`;
        const values = [ id ];
        let [article] = await this.repository.executeQuery(sql, values);
        article = this.convertArticleDateFormat(article[0]);
        return article;
    }

    async insertArticle(title, content, author) {
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

    async deleteArticleById(id) {
        const sql = `DELETE FROM BOARD WHERE BOARD_NO=?;`;
        const values = [ id ];
        const [res] = await this.repository.executeQuery(sql, values);
        return res.affectedRows;
    }

    async updateArticle(article_num, title, content) {
        const time = this.getTime(); 
        const sql = 'UPDATE BOARD SET TITLE=?, content=?, UPDATE_DATE=? WHERE BOARD_NO=?;';
        const values = [title, content, time, article_num];
        const [res] = await this.repository.executeQuery(sql, values);
        return res.changedRows;
    }

    /**
     * CommentService
     */

    async getMaxCommentOrder(id, group_num) {
        const sql = `SELECT MAX(comment_order) AS maxCommentOrder FROM comment WHERE article_num=? AND group_num=?;`;
        const values = [ id, group_num];
        const [[res]] = await this.repository.executeQuery(sql, values);
        res.maxCommentOrder ??= 0;
        return res.maxCommentOrder;
    }
    
    async getNewGroupNum(id) {
        const sql = `SELECT MAX(comment.group_num) AS maxGroupNum FROM BOARD LEFT JOIN comment ON BOARD.BOARD_NO=comment.article_num WHERE BOARD.BOARD_NO=?;`;
        const values = [ id ];
        const [[res]] = await this.repository.executeQuery(sql, values);
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
    
    async getCommentsByArticleId(article_num) {
        // const sql = "SELECT * FROM COMMENT WHERE article_num='"+article_num+"';";
        const sql = `SELECT * FROM comment WHERE article_num=? ORDER BY group_num, comment_order ASC;`
        const values = [ article_num ];
        let [comments] = await this.repository.executeQuery(sql, values);
        return comments;
    }
    
    async insertComment(article_num, author, content) {
        const sql = `INSERT INTO comment (article_num, author, time, class, comment_order, group_num, content) VALUES ?;`;
        const time = this.getTime();
        const depth = 0;
        const new_group = await this.getNewGroupNum(article_num);
        // const comment_order = parseInt(length) + 1;
        const comment_order = await this.getMaxCommentOrder(article_num, new_group)+1;
        let values = [
            [article_num, author, time, depth, comment_order, new_group, content]
        ];
        const [res] = await this.repository.executeQuery(sql, [values]);
        return res.affectedRows;
    }
    
    async editCommentByNum(id, content) {
        const query = `UPDATE comment SET content=? WHERE comment_num=?;`;
        const values = [content, id];
        const [res] = await this.repository.executeQuery(query, values);
        return res.affectedRows;
    }
    
    async insertReply(article_num, author, group_num, content) {
        const sql = `INSERT INTO comment (article_num, author, time, class, comment_order, group_num, content) VALUES ?;`;
        const time = this.getTime();
        const depth = 1;
        const comment_order = await this.getMaxCommentOrder(article_num, group_num)+1;
        let values = [
            [article_num, author, time, depth, comment_order, group_num, content]
        ];
        const [res] = await this.repository.executeQuery(sql, [values]);
        return res.affectedRows;
    }
    
    async getCommentAuthorById(id) {
        const sql = `SELECT author FROM comment WHERE comment_num=?;`;
        const values = [ id ];
        const [[commentAuthor]] = await this.repository.executeQuery(sql, values);
        return commentAuthor.author;
    }
    
    async deleteComment(id) {
        const sql = `UPDATE comment SET author='deleted', content='deleted', time=NULL WHERE comment_num=?;`;
        const values = [ id ];
        const [res] = await this.repository.executeQuery(sql, values);
        return res.affectedRows;
    }
    
    async getPaginatedArticlesByTitle(title, currentPage, itemsPerPage) {
        const matchingTitleCount = await this.getMatchingTitleCount(title); 
        const pagination = await this.getPageItems(matchingTitleCount, currentPage, itemsPerPage);
        const articles = await this.searchArticlesByTitle(title, pagination.startIndex, pagination.endIndex);
        return { articles, pagination };
    }

    async getArticleItems(id) {
        const article = await this.getArticleById(id);
        const comments = await this.getCommentsByArticleId(id);
        return { article, comments };
    }

    async validateUserWithAuthor(userId, resourceType, resourceId) {
        switch(resourceType) {
            case 'article': {
                const article = await this.getArticleById(resourceId);
                return userId===article.AUTHOR;
            }
            case 'comment': {
                const commentAuthor = await this.getCommentAuthorById(resourceId); 
                return userId===commentAuthor;
            }
            default:
                return false;
        }
    }
}

module.exports = boardService;

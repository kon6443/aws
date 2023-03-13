/**
 * boardConroller.js
 */

const path = require('path');

class BoardController {
    constructor(container) {
        this.serviceInstance = container.get('boardService');
        this.userServiceInstance = container.get('userService');
    }
    authenticationMethodMiddleware = async (req, res, next) => {
        const jwtDecodedUserInfo = req.decoded;
        const kakao_access_token = req.session.access_token;
        req.user = await this.userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, kakao_access_token);
        return next();
    }
    // Main page.
    showMain = async (req, res, next) => {
        if(req.query.search) return next();
        // totalItems, currentPage, itemsPerPage
        let { search, page, limit } = req.query;
        console.log('search:', search,', page:', page,', limit:', limit);
        let articles = await this.serviceInstance.getAllArticles();
        const boardObject = await this.serviceInstance.getPageItems(articles.length, page, limit);
        return res.render(path.join(__dirname, '../../views/board/board'), {
            articles: articles, 
            user: (req.decoded) ? (req.decoded.id) : ('Guest'),
            page_current: boardObject.currentPage, 
            last_page: boardObject.totalPages, 
            length: boardObject.totalItems, 
            limit: boardObject.itemsPerPage, 
            range_min: boardObject.startIndex,
            range_max: boardObject.endIndex,
            search: search
        });
    }

    searchArticleTitle = async (req, res) => {
        let { search, page, limit } = req.query;
        let articles = await this.serviceInstance.searchArticlesByTitle(search);
        if(articles.length === 0) {
            return res.send("<script>alert('No matching article.'); window.location.href = '/board';</script>");
        }
        const boardObject = await this.serviceInstance.getPageItems(articles.length, page, limit);
        return res.render(path.join(__dirname, '../../views/board/board'), {
            articles: articles,
            user: (req.decoded) ? (req.decoded.id) : ('Guest'),
            page_current: boardObject.currentPage,
            last_page: boardObject.totalPages, 
            length: boardObject.totalItems, 
            limit: boardObject.itemsPerPage, 
            range_min: boardObject.startIndex,
            range_max: boardObject.endIndex,
            search: search
        });
    }

    writeArticle = async (req, res) => {
        const user = req.user;
        return res.render(path.join(__dirname, '../../views/board/boardWrite'), {user:user});
    }
    
    showArticle = async (req, res, next) => {
        if(req.query.keyStroke) return next();
        if(req.query.search) return next();
        const user = req.user;
        const article_num = req.params.id;
        const article = await this.serviceInstance.showArticleByNum(article_num);
        const comments = await this.serviceInstance.getComments(article_num);
        return res.render(path.join(__dirname, '../../views/board/article'), {user:user, article: article, comments: comments, length: comments.length});
    }

    autoComplete = async (req, res, next) => {
        if(req.query.search) return next();
        const keyStroke = req.query.keyStroke;
        const titles = await this.serviceInstance.searchTitleByChar(keyStroke);
        return res.status(200).send(titles).end();
    }

    deleteArticle = async (req, res, next) => {
        if(req.body.comment_num) return next();
        const user = req.user;
        const { article_num } = req.body;
        let article = await this.serviceInstance.showArticleByNum(article_num);
        if(user.id!==article.AUTHOR) {
            return res.status(200).send('Account not matched.').end();
        }
        const affectedRows = await this.serviceInstance.deleteByNum(article_num);
        if(affectedRows===1) {
            return res.status(200).send('Article has been removed.').end(); 
        } else {
            return res.status(200).send('Something went wrong').end(); 
        }
    
    }

    deleteComment = async (req, res) => {
        const user = req.user;
        const { comment_num } = req.body;
        const commentAuthor = await this.serviceInstance.getCommentAuthorByNum(comment_num);
        if(user.id!==commentAuthor) {
            return res.status(200).send('Account not matched.').end();
        }
        const affectedRows = await this.serviceInstance.deleteComment(comment_num);
        if(affectedRows===1) {
            return res.status(200).send('Comment has been removed.').end();
        } else {
            return res.status(200).send('Something went wrong').end();
        }
    }
    postResource = async (req, res) => {
        const user = req.user;
        const { resourceType, id } = req.params;
        switch(resourceType) {
            case 'article': {
                const { title, content } = req.body; 
                const affectedRows = await this.serviceInstance.insert(title, content, user.id);
                if(affectedRows===1) {
                    return res.status(200).send('Article has been posted.').end(); 
                } else {
                    return res.status(400).send('Something went wrong').end();
                }
            }
            case 'comment': {
                const { content } = req.body;
                const affectedRows = await this.serviceInstance.insertComment(id, user.id, content);
                if(affectedRows===1) {
                    return res.status(200).send('Comment has been posted.');
                } else {
                    return res.status(400).send('Something went wrong.');
                }
            }
            default:
                return res.status(400).send('Invalid resource type.');
        }
    }

    replyComment = async (req, res) => {
        const user = req.user;
        const { article_num, group_num, content } = req.body;
        const affectedRows = await this.serviceInstance.insertReply(article_num, user.id, group_num, content);
        if(affectedRows===1) {
            return res.status(200).send('Reply has been posted.');
        } else {
            return res.status(200).send('Something went wrong.');
        }
    }

    showEditingArticle = async (req, res) => {
        const user = req.user;
        const { id } = req.params;
        const article = await this.serviceInstance.showArticleByNum(id);
        if(user.id===article.AUTHOR) {
            return res.render(path.join(__dirname, '../../views/board/editArticle'), {user:user, article:article});
        }
    }

    updateResource = async (req, res) => {
        const user = req.user;
        const { resourceType, id } = req.params;
        switch(resourceType) {
            case 'article': {
                const { title, content } = req.body;
                const changedRows = await this.serviceInstance.updateArticle(id, title, content);
                if(changedRows===1) {
                    return res.status(200).send('Your article has been editied.');
                } else {
                    return res.status(400).json({ error: 'Something went wrong.' });s 
                }
            }
            case 'comment': {
                const { content } = req.body;
                const commentAuthor = await this.serviceInstance.getCommentAuthorByNum(id);
                if(user.id!==commentAuthor) {
                    return res.status(200).send('Account not matched.').end();
                }
                const affectedRows = await this.serviceInstance.editCommentByNum(id, content);
                if(affectedRows===1) {
                    return res.status(200).send('Comment has been updated.').end();
                } else {
                    return res.status(400).send('Something went wrong.').end();
                } 
            }
            default:
                return res.status(400).json({ error: 'Invalid resource type.' });
        }
    }
}

module.exports = BoardController;

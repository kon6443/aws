/**
 * boardConroller.js
 */

const path = require('path');

class BoardController {
    constructor(container) {
        this.serviceInstance = container.get('ArticleService');
    }

    handleMainRequest = async (req, res, next) => {
        const user = req.user;
        const { search, 'current-page': currentPage, 'items-per-page': itemsPerPage } = req.query;
        const { articles, pagination } = await this.serviceInstance.getPaginatedArticlesByTitle(search, currentPage, itemsPerPage);
        if(articles.length===0) {
            return res.status(400).send('There is no matching result.').end();
        }
        return res.render(path.join(__dirname, '../../views/board/articles'), {
            articles, 
            user: (user) ? (user.id) : ('Guest'),
            pagination,
            search
        });
    }

    handleGetAutoComplete = async (req, res, next) => {
        try {
            const { keyStroke } = req.query;
            const titles = await this.serviceInstance.searchTitleByChar(keyStroke);
            return res.status(200).send(titles).end();
        } catch(err) {
            console.error(err); 
            return res.status(500).send(err.message);
        }
    }

    handleGetWritingArticleForm = async (req, res) => {
        try {
            const user = req.user;
            return res.render(path.join(__dirname, '../../views/board/boardWrite'), {user:user});
        } catch(err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }

    handleGetArticle = async (req, res, next) => {
        try {
            const user = req.user;
            const { id } = req.params;
            const { article, comments } = await this.serviceInstance.getArticleItems(id);
            return res.render(path.join(__dirname, '../../views/board/article'), {user, article, comments});
        } catch(err) {
            console.error(err); 
            return res.status(500).send(err.message);
        }
    }

    handleGetEditingArticleForm = async (req, res) => {
        const user = req.user;
        const { id } = req.params;
        try {
            const article = await this.serviceInstance.getArticleById(id);
            if(user.id===article.AUTHOR) {
                return res.render(path.join(__dirname, '../../views/board/editArticle'), {user:user, article:article});
            } 
        } catch(err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }
    
    handlePostResource = async (req, res) => {
        const user = req.user;
        /**
         * In new, id refers nothing. undefined.
         * In comment, id refers article_id.
         * In reply, id refers comment_id that a user is replying to.
         */
        const { resourceType, id } = req.params;
        try {
            switch(resourceType) {
                case 'new': {
                    const { title, content } = req.body; 
                    var affectedRows = await this.serviceInstance.insertArticle(title, content, user.id);
                    break;
                }
                case 'comment': {
                    const { content } = req.body;
                    var affectedRows = await this.serviceInstance.insertComment(id, user.id, content);
                    break;
                }
                case 'reply': {
                    const { group_num, content } = req.body;
                    var affectedRows = await this.serviceInstance.insertReply(id, user.id, group_num, content);
                    break;
                }
                default:
                    return res.status(400).send('Invalid resource type.');
            }
            if(affectedRows===1) {
                return res.status(201).send(`${resourceType} has been posted.`);
            } else {
                return res.status(400).send('Something went wrong.');
            }
        } catch(err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }

    handleUpdateResource = async (req, res) => {
        const user = req.user;
        const { resourceType, id } = req.params;
        const isUserValidated = await this.serviceInstance.validateUserWithAuthor(user.id, resourceType, id);
        if(!isUserValidated) {
            return res.status(400).send('Account not matched.').end();
        }
        try {
            switch(resourceType) {
                case 'article': {
                    const { title, content } = req.body;
                    var affectedRows = await this.serviceInstance.updateArticle(id, title, content);
                    break;
                }
                case 'comment': {
                    const { content } = req.body;
                    var affectedRows = await this.serviceInstance.editCommentByNum(id, content);
                    break;
                }
                default:
                    return res.status(400).json({ error: 'Invalid resource type.' });
            }
            if(affectedRows===1) {
                return res.status(200).send(`${resourceType} has been updated.`);
            } else {
                return res.status(400).json({ error: 'Something went wrong.' });s 
            }
        } catch(err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }

    handleDeleteResource = async (req, res, next) => {
        const user = req.user;
        const { resourceType, id } = req.params;
        const isUserValidated = await this.serviceInstance.validateUserWithAuthor(user.id, resourceType, id);
        if(!isUserValidated) {
            return res.status(400).send('Account not matched.').end();
        }
        try {
            switch(resourceType) {
                case 'article': {
                    var affectedRows = await this.serviceInstance.deleteArticleById(id);
                    break;
                }
                case 'comment': {
                    var affectedRows = await this.serviceInstance.deleteComment(id);
                    break;
                }
                default: 
                    break;
            }
            if(affectedRows===1) {
                return res.status(200).send(`${resourceType} has been removed.`).end(); 
            } else {
                return res.status(400).send('Something went wrong').end(); 
            }
        } catch(err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    }

}

module.exports = BoardController;

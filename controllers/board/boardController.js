/**
 * boardConroller.js
 */

const path = require('path');

class BoardController {
    constructor(container) {
        this.serviceInstance = container.get('boardService');
        this.userServiceInstance = container.get('userService');
    }

    handleMainRequest = async (req, res, next) => {
        const user = req.user;
        const { search, 'current-page': currentPage, 'items-per-page': itemsPerPage } = req.query;
        const { articles, pagination } = await this.serviceInstance.getPaginatedArticlesByTitle(search, currentPage, itemsPerPage);
        if(articles.length===0) {
            return res.status(200).send('There is no matching result.').end();
        }
        return res.render(path.join(__dirname, '../../views/board/board'), {
            articles, 
            user: (user) ? (user.id) : ('Guest'),
            pagination,
            search
        });
    }

    displayArticleForm = async (req, res) => {
        const user = req.user;
        return res.render(path.join(__dirname, '../../views/board/boardWrite'), {user:user});
    }
    
    getArticle = async (req, res, next) => {
        // if(req.query.keyStroke) return next();
        // if(req.query.search) return next();
        const user = req.user;
        const { id } = req.params;
        const article = await this.serviceInstance.showArticleByNum(id);
        const comments = await this.serviceInstance.getComments(id);
        return res.render(path.join(__dirname, '../../views/board/article'), {user:user, article: article, comments: comments, length: comments.length});
    }

    autoComplete = async (req, res, next) => {
        // if(req.query.search) return next();
        const { keyStroke } = req.query;
        const titles = await this.serviceInstance.searchTitleByChar(keyStroke);
        return res.status(200).send(titles).end();
    }
    deleteResource = async (req, res, next) => {
        const user = req.user;
        const { resourceType, id } = req.params;
        switch(resourceType) {
            case 'article': {
                const article = await this.serviceInstance.showArticleByNum(id);
                if(user.id!==article.AUTHOR) {
                    return res.status(400).send('Account not matched.').end();
                }
                const affectedRows = await this.serviceInstance.deleteByNum(id);
                if(affectedRows===1) {
                    return res.status(200).send('Article has been removed.').end(); 
                } else {
                    return res.status(400).send('Something went wrong').end(); 
                }
            }
            case 'comment': {
                const commentAuthor = await this.serviceInstance.getCommentAuthorByNum(id);
                if(user.id!==commentAuthor) {
                    return res.status(400).send('Account not matched.').end();
                }
                const affectedRows = await this.serviceInstance.deleteComment(id);
                if(affectedRows===1) {
                    return res.status(200).send('Comment has been removed.').end();
                } else {
                    return res.status(400).send('Something went wrong').end();
                }
            }
            default: 
                break;
        }
    }
    
    postResource = async (req, res) => {
        const user = req.user;
        /**
         * In article, id refers nothing. undefined.
         * In comment, id refers article_id.
         * In reply, id refers comment_id that a user is replying to.
         */
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
            case 'reply': {
                const { group_num, content } = req.body;
                const affectedRows = await this.serviceInstance.insertReply(id, user.id, group_num, content);
                if(affectedRows===1) {
                    return res.status(200).send('Reply has been posted.');
                } else {
                    return res.status(400).send('Something went wrong.');
                }
            }
            default:
                return res.status(400).send('Invalid resource type.');
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

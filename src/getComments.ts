import { Comment, ECSError, Feedback } from './types'

export function getComments(feedback: Array<Feedback>): Array<Comment> {
    const comments: Array<Comment> = []

    for (const value of feedback) {
        const c: Array<Comment> = value.feedback.filter((a: ECSError, index: number, self: Array<ECSError>) => {
            return index === self.findIndex((b: ECSError) =>
                a.message === b.message
                && a.line === b.line
            );
        }).map((error: ECSError) => {
            const comment: Comment = {
                path: error.file_path,
                body: `${error.message}\n\nSource: ${error.source_class}`,
                side: 'RIGHT',
                start_side: 'RIGHT',
                line: error.line
            };

            return comment;
        });

        comments.push(...c);
    }

    return comments;
}
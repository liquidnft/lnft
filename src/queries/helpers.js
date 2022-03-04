export const getAppProps = `
    query {
        users(order_by: { username: asc }) {
            id
            address
            multisig
            username
            avatar_url
        }

        artworks {
            id
            asset
            edition
            editions
            title
            owner_id
        }

        popups: announcements(limit: 1, order_by: {created_at: desc}, where: {visible_end: {_gte: "now()"}, visible_start: {_lte: "now()"}, type: {_eq: "popup"}}) {
            text
            id
            type
            dismissible
        }
    }
    
`;



export default function useUniqueId() {
    function id() {
        return Math.floor(Math.random() * 100);
    }

    return {
        id
    };
}

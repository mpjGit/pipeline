<template>
    <!-- 全局Toast -->
    <transition name="fade" duration="500" v-if="message">
        <div class="toast-message-container">
            <div class="toast-message">
                {{message}}
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Toast",
        computed: {
            message() {
                return this.$store.state.toast.message;
            },
        }
    }
</script>

<style scoped lang="less">
    .toast-message-container {
        pointer-events: none;
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        color: white;
        font-size: 0.2rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .toast-message {
            max-width: 4rem;
            padding: 0.3rem;
            font-family: monospace;
            box-sizing: border-box;
            height: auto;
            background: rgba(0,0,0,0.8);
            border-radius: 0.13rem;
        }
    }
</style>

<template>
    <div class="flex min-h-screen flex-col">
        <AppHeader/>

        <main
                id="main"
                class="container-page flex-1 py-10 lg:py-14"
                tabindex="-1"
        >
            <div class="post-column mx-auto">
                <slot/>
            </div>
        </main>

        <AppFooter/>
    </div>
</template>

<template>
    <div class="app-shell">
        <AppFloatingNavigation/>

        <main
                id="main"
                class="container-page flex-1 py-10 lg:py-14"
                tabindex="-1"
        >
            <slot/>
        </main>

        <AppFooter/>
    </div>
</template>

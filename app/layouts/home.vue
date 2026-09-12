<template>
    <div class="app-shell">
        <AppFloatingNavigation/>

        <main
                id="main"
                class="flex-1"
                tabindex="-1"
        >
            <slot/>
        </main>

        <AppFooter/>
    </div>
</template>

const app = Vue.createApp({
    data() {
        return {
            lessons: [],
            sortBy: localStorage.getItem("sortBy") ? localStorage.getItem("sortBy") : "price",
            ascending: localStorage.getItem("ascending") ? localStorage.getItem("ascending") === 'true' : true,
            cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
            name: "",
            phoneNumber: "",
            submitted: false
        }
    },
    //This function will read the data from jason file 
    created() {
        if (!JSON.parse(localStorage.getItem("lessons"))) {
            fetch('lessons.json')
                //here I convert the jason to js objects
                .then((res) => res.json())
                .then((data) => {
                    this.lessons = data;
                    localStorage.setItem("lessons", JSON.stringify(this.lessons));
                })
                .catch((err) => console.log(err));
        } else {
            this.lessons = JSON.parse(localStorage.getItem("lessons"));
        }
    },

    methods: {
        ascChange(ascending) {
            this.ascending = ascending;
            localStorage.setItem("ascending", this.ascending)
        },
        addLessonToCart(lesson) {
            if (lesson.spaces > 0) {
                this.cart.push({
                    id: lesson.id,
                    subject: lesson.subject,
                    location: lesson.location,
                    price: lesson.price,
                });
                let lessonIndex = this.lessons.indexOf(lesson);
                this.lessons[lessonIndex].spaces = this.lessons[lessonIndex].spaces - 1;
            }
            localStorage.setItem("cart", JSON.stringify(this.cart));
            localStorage.setItem("lessons", JSON.stringify(this.lessons));
        },
        removeLessonFromcart(lesson) {
            let cartIndex = this.cart.indexOf(lesson);
            this.cart.splice(cartIndex, 1);
            localStorage.setItem("cart", JSON.stringify(this.cart));

            for (let i = 0; i < this.lessons.length; i++) {
                if (this.lessons[i].id === lesson.id) {
                    this.lessons[i].spaces += 1;
                    localStorage.setItem("lessons", JSON.stringify(this.lessons));
                }
            }
        },
        onSortChange(sortBy) {
            this.sortBy = sortBy;
            localStorage.setItem("sortBy", JSON.stringify(this.sortBy));
        },

        isLessonFull(lesson) {
            if (lesson.spaces === 0) return true;
        },

        iscartEmpty() {
            if (this.cart.length === 0) return true;
        },

        editName(e) {
            if (e.target.value.match(/^[A-Za-z]+$/)) {
                this.name = e.target.value;
            }
        },

        editPhoneNumber(e) {
            if (e.target.value.match(/^\d+$/)) this.phoneNumber = e.target.value;
        },

        addPersonalInfo(e) {
            this.submitted = !this.submitted;
        }
    },
    computed: {
        sortLessons() {
            switch (this.sortBy) {
                case "subject":
                    this.lessons.sort(function compare(a, b) {
                        if (a.subject > b.subject) return 1;
                        if (b.subject > a.subject) return -1;
                        return 0;
                    });
                    break;
                case "location":
                    this.lessons.sort(function compare(a, b) {
                        if (a.location > b.location) return 1;
                        if (b.location > a.location) return -1;
                        return 0;
                    });
                    break;
                case "price":
                    this.lessons.sort(function compare(a, b) {
                        if (a.price > b.price) return 1;
                        if (b.price > a.price) return -1;
                        return 0;
                    });
                    break;
                case "spaces":
                    this.lessons.sort(function compare(a, b) {
                        if (a.spaces > b.spaces) return 1;
                        if (b.spaces > a.spaces) return -1;
                        return 0;
                    });
                    break;
                default:
                    this.lessons.sort(function compare(a, b) {
                        if (a.price > b.price) return 1;
                        if (b.price > a.price) return -1;
                        return 0;
                    });
            }

            if (!this.ascending) {
                this.lessons.reverse();
            }

            return this.lessons;
        },
    }
});

app.mount("#App");

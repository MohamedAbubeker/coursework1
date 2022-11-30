const app = Vue.createApp({
    data() {
        return {
            lessons: [],
            sortBy: localStorage.getItem("sortBy") ? JSON.parse(localStorage.getItem("sortBy")) : "price",
            ascending: localStorage.getItem("ascending") ? JSON.parse(localStorage.getItem("ascending")) : true,
            cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
            name: "",
            phoneNumber: "",
            submitted: false
        }
    },
    //This function will read the data from json file 
    created() {
        if (!JSON.parse(localStorage.getItem("lessons"))) {
            fetch('lessons.json')
                //here I convert the json to js objects
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
    watch: {
        phoneNumber(newValue, oldValue) {
            if (newValue === "") {  // this if statement added to avoid infinite loop as /^\d+$/ regex doesn't match the empty string
                this.editPhoneNumber("");
            } else if (/^\d+$/.test(newValue)) {
                this.editPhoneNumber(newValue);
            } else {
                this.editPhoneNumber(oldValue)
            }
        },
        name(newValue, oldValue) {
            if (newValue === "") {
                this.editName("");
            } else if (/^[A-Za-z]+$/.test(newValue)) {
                this.editName(newValue);
            } else {
                this.editName(oldValue)
            }
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
                    url: lesson.url
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

        editName(value) {
            this.name = value;
        },

        editPhoneNumber(value) {
            this.phoneNumber = value;
        },
        checkForm(e) {
            if (this.name && this.phoneNumber && /^[A-Za-z]+$/.test(this.name) && /^\d+$/.test(this.phoneNumber)) {
                alert("submitted");
            } else if (this.name && this.phoneNumber && !/^[A-Za-z]+$/.test(this.name) && /^\d+$/.test(this.phoneNumber)) {
                alert("invalid name") 
            } else if (this.name && this.phoneNumber && /^[A-Za-z]+$/.test(this.name) && !/^\d+$/.test(this.phoneNumber)) {
                alert("invalid phone number") 
            } else if (this.name && this.phoneNumber && !/^[A-Za-z]+$/.test(this.name) && !/^\d+$/.test(this.phoneNumber)) {
                alert("invalid name & phone number") 
            }
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

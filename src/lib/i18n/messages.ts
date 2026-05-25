// ─── Translation messages — English default, Thai secondary ──────────────────

export type Locale = "en" | "th";
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["en", "th"];

type Schema = {
  nav: Record<
    | "home"
    | "games"
    | "forums"
    | "tunes"
    | "calculator"
    | "guideline"
    | "blog"
    | "search"
    | "signIn"
    | "register"
    | "profile"
    | "myTunes"
    | "savedTunes"
    | "settings"
    | "signOut"
    | "soon",
    string
  >;
  footer: Record<
    | "tagline"
    | "platformTitle"
    | "gamesTitle"
    | "contactTitle"
    | "browseTunes"
    | "tuneCalculator"
    | "forums"
    | "uploadTune"
    | "discord"
    | "facebook"
    | "reportBug"
    | "privacy"
    | "terms"
    | "copyright",
    string
  >;
  auth: Record<
    | "loginTitle"
    | "forgotTitle"
    | "changeTitle"
    | "tabLogin"
    | "tabForgot"
    | "tabChange"
    | "email"
    | "password"
    | "newPassword"
    | "confirmPassword"
    | "oldPassword"
    | "signInButton"
    | "signingIn"
    | "resetButton"
    | "resetting"
    | "changeButton"
    | "changing"
    | "noAccount"
    | "signUp"
    | "hasAccount"
    | "forgotHint"
    | "changeHint"
    | "strengthEasy"
    | "strengthMedium"
    | "strengthStrong"
    | "registerTitle"
    | "registerSubtitle"
    | "username"
    | "usernamePlaceholder"
    | "usernameHint"
    | "usernameChecking"
    | "gender"
    | "male"
    | "female"
    | "unspecified"
    | "country"
    | "countryNone"
    | "birthday"
    | "birthdayHint"
    | "uploadAvatar"
    | "registerButton"
    | "registering"
    | "required"
    | "errInvalidCred"
    | "errEmailNotConfirmed"
    | "errTooManyReq"
    | "errFillEmailPw"
    | "errFillEmail"
    | "errPwMin8"
    | "errPwMismatch"
    | "errFillAll"
    | "errPwSame"
    | "errInvalidEmail"
    | "errUsernameMin3"
    | "errUsernameTaken"
    | "errFillUsername"
    | "errAvatarSize"
    | "errGeneric"
    | "okResetDone"
    | "okChangeDone"
    | "pwMatch"
    | "pwNoMatch",
    string
  >;
  home: Record<
    | "badge"
    | "heroTitle"
    | "heroTitleAt"
    | "heroDesc"
    | "browseTunes"
    | "uploadTune"
    | "statTunes"
    | "statTuners"
    | "statGames"
    | "gamesTitle"
    | "noTunes"
    | "recentTitle"
    | "viewAll"
    | "noPosts"
    | "beFirstPost"
    | "catAnnouncement"
    | "catGeneral"
    | "catReport"
    | "statusLive"
    | "statusSoon"
    | "statusComing"
    | "landingBadge"
    | "landingHeroTitle"
    | "landingHeroTitleAccent"
    | "landingHeroDesc"
    | "landingCtaCalculate"
    | "landingCtaSecondary"
    | "landingHowTitle"
    | "landingHow1Title"
    | "landingHow1Desc"
    | "landingHow2Title"
    | "landingHow2Desc"
    | "landingHow3Title"
    | "landingHow3Desc"
    | "landingFeaturesTitle"
    | "landingFeatFree"
    | "landingFeatFreeDesc"
    | "landingFeatNoLogin"
    | "landingFeatNoLoginDesc"
    | "landingFeatFh6"
    | "landingFeatFh6Desc"
    | "landingFeatAllDriv"
    | "landingFeatAllDrivDesc"
    | "landingTipsTitle"
    | "landingTipsReadMore"
    | "landingPickGame"
    | "landingFh5Tagline"
    | "landingFh6Tagline",
    string
  >;
  tunes: Record<
    | "title"
    | "pickSub"
    | "pickTitle"
    | "pickGameSub"
    | "comingSoon"
    | "browseCta"
    | "backGames"
    | "searchAll"
    | "searchTunes"
    | "results"
    | "noFound"
    | "noFoundTip"
    | "shareCtaHighlight"
    | "shareCtaBody"
    | "shareTune"
    | "tryFilters"
    | "resetAll"
    | "beFirst"
    | "prevPage"
    | "nextPage"
    | "views"
    | "edited"
    | "unknown",
    string
  >;
  tuneDetail: Record<
    | "home"
    | "breadTunes"
    | "featured"
    | "by"
    | "save"
    | "saved"
    | "copied"
    | "copyCode"
    | "editTune"
    | "cancel"
    | "car"
    | "carReadOnly"
    | "editTitle"
    | "titleField"
    | "descField"
    | "shareCodeField"
    | "gameVersionField"
    | "titlePlaceholder"
    | "descPlaceholder"
    | "shareCodePlaceholder"
    | "versionPlaceholder"
    | "saving"
    | "saveChanges"
    | "stats"
    | "upvotes"
    | "views"
    | "comments"
    | "version"
    | "shareCode"
    | "links"
    | "browseTunes"
    | "shareTune"
    | "tuneCalc"
    | "commentTitle"
    | "commentPlaceholder"
    | "posting"
    | "postComment"
    | "noComments"
    | "notFoundTitle"
    | "notFoundDesc"
    | "backTunes"
    | "loading"
    | "titleRequired"
    | "errGeneric",
    string
  >;
  forums: Record<
    | "title"
    | "subtitle"
    | "newPost"
    | "viewAll"
    | "addAnnouncement"
    | "catAnnouncement"
    | "catAnnouncementSub"
    | "catGeneral"
    | "catGeneralSub"
    | "catReports"
    | "catReportsSub"
    | "emptyAnnouncements"
    | "emptyGeneral"
    | "emptyReports"
    | "comments",
    string
  >;
  calc: Record<
    | "title"
    | "subtitle"
    | "balanceFront"
    | "rearHeavy"
    | "neutral"
    | "frontHeavy"
    | "drivetrain"
    | "discipline"
    | "weight"
    | "power"
    | "torque"
    | "calculate"
    | "loadingBtn"
    | "loginBtn"
    | "loginPromptTitle"
    | "signIn"
    | "register"
    | "noResultHint"
    | "noResultSub"
    | "gearDragNote"
    | "gearNote"
    | "casterNote"
    | "warningNote"
    | "rideHeightLowest"
    | "rideHeightLow"
    | "rideHeightMid"
    | "rideHeightHigh"
    | "arbNoteAWD"
    | "arbNoteRWD"
    | "arbNoteFWD"
    | "aeroNote"
    | "driftNote",
    string
  >;
  settings: Record<
    | "title"
    | "langTitle"
    | "langDesc"
    | "langUpdated"
    | "notLoggedIn"
    | "logIn"
    | "profileTitle"
    | "profileDesc"
    | "profileLink"
    | "passwordTitle"
    | "passwordDesc"
    | "passwordLink"
    | "signOutTitle"
    | "signOutDesc"
    | "signOut"
    | "signingOut",
    string
  >;
  saved: Record<
    | "title"
    | "subtitle"
    | "savedCount"
    | "empty"
    | "emptyDesc"
    | "browseTunes"
    | "loginError"
    | "loadError"
    | "unsave"
    | "views"
    | "savedLabel"
    | "edited"
    | "comingSoon"
    | "comingDesc"
    | "browseTunesCta"
    | "prevPage"
    | "nextPage",
    string
  >;
  search: Record<
    | "hint"
    | "loading"
    | "noResults"
    | "groupTunes"
    | "groupUsers"
    | "groupCars"
    | "seeAllTunes"
    | "closeOverlay",
    string
  >;
  profileCard: Record<
    | "editBtn"
    | "cancelTitle"
    | "editHeading"
    | "changeAvatar"
    | "avatarHint"
    | "usernameHint"
    | "bioPlaceholder"
    | "genderLabel"
    | "genderMale"
    | "genderFemale"
    | "genderUnspecified"
    | "countryLabel"
    | "countryNone"
    | "birthdayLabel"
    | "joinedPrefix"
    | "saveSuccess"
    | "saving"
    | "saveBtn"
    | "cancelBtn"
    | "errAvatarSize"
    | "errUsernameMin3"
    | "errSaveFailed"
    | "errGeneric",
    string
  >;
  newPost: Record<
    | "addText"
    | "addImage"
    | "textPlaceholder"
    | "changeImage"
    | "uploading"
    | "dropHint"
    | "selectFile"
    | "imageHint"
    | "errFileType"
    | "errFileSizePrefix"
    | "errLoginRequired"
    | "errNoTitle"
    | "errNoContent"
    | "errImageUploading"
    | "errGeneric"
    | "errRetry"
    | "pageTitle"
    | "categoryLabel"
    | "catGeneral"
    | "catGame"
    | "catReport"
    | "catAnnouncement"
    | "gameLabel"
    | "selectGame"
    | "titleLabel"
    | "titlePlaceholder"
    | "contentLabel"
    | "maxImagesPrefix"
    | "maxImagesSuffix"
    | "cancel"
    | "submitting"
    | "submitBtn",
    string
  >;
  shareTune: Record<
    | "back"
    | "pageTitle"
    | "changeGame"
    | "subtitle"
    | "pickTitle"
    | "pickSub"
    | "fh6Note"
    | "carSectionTitle"
    | "brandLabel"
    | "loadingCars"
    | "selectBrand"
    | "modelLabel"
    | "selectModel"
    | "selectClassFirst"
    | "tiresUnit"
    | "included"
    | "notIncluded"
    | "gearCountLabel"
    | "speedSuffix"
    | "upgradesTitle"
    | "upgradesOptional"
    | "upgradesHint"
    | "upgradeSoon"
    | "tuneInfoTitle"
    | "tuneTitleLabel"
    | "tuneTitlePlaceholder"
    | "tuneDescLabel"
    | "tuneDescPlaceholder"
    | "shareCodeLabel"
    | "shareCodePlaceholder"
    | "errNoDiscipline"
    | "errNoTitle"
    | "errNoParams"
    | "errGeneric"
    | "errRetry"
    | "cancelBtn"
    | "uploading"
    | "submitBtn",
    string
  >;
  game: Record<
    | "notFound"
    | "backHome"
    | "comingSoonDesc"
    | "home"
    | "brandsLabel"
    | "topTunesTitle"
    | "topTunesSub"
    | "periodWeek"
    | "periodMonth"
    | "periodAll"
    | "topLoading"
    | "topEmpty"
    | "tuneLabTitle"
    | "tuneLabSub"
    | "autoCalcTitle"
    | "autoCalcDesc"
    | "calcBtn"
    | "shareTuneTitle"
    | "shareTuneDesc"
    | "shareTuneBtn"
    | "carBrandsTitle"
    | "carBrandsSub"
    | "allTunesTitle"
    | "allTunesSub"
    | "allTunesCardPrefix"
    | "allTunesCardSuffix"
    | "allTunesCardDesc"
    | "allTunesBtn"
    | "subtitleFH5"
    | "subtitleFH6"
    | "subtitleNFS",
    string
  >;
  titles: Record<
    | "sectionHeader"
    | "noTitles"
    | "newcomer"
    | "newcomerDesc"
    | "firstTune"
    | "firstTuneDesc"
    | "tuner10"
    | "tuner10Desc"
    | "tuner30"
    | "tuner30Desc"
    | "tuner100"
    | "tuner100Desc"
    | "liked10"
    | "liked10Desc"
    | "liked50"
    | "liked50Desc"
    | "liked100"
    | "liked100Desc",
    string
  >;
  profilePage: Record<
    | "notFoundPrefix"
    | "backHome"
    | "statTunes"
    | "statUpvotes"
    | "statViews"
    | "statTitles"
    | "tunesByGame"
    | "allTunesPrefix"
    | "noTunes"
    | "shareFirstTune"
    | "viewAllInGame"
    | "edited",
    string
  >;
  guideline: Record<
    | "badge"
    | "title"
    | "subtitle"
    | "newPost"
    | "newPostTitle"
    | "empty"
    | "comments"
    | "commentsTitle"
    | "noComments"
    | "notFound"
    | "backList"
    | "breadHome"
    | "tocTitle"
    | "sections"
    | "titleLabel"
    | "titlePlaceholder"
    | "excerptLabel"
    | "excerptPlaceholder"
    | "coverUrlLabel"
    | "contentLabel"
    | "textPlaceholder"
    | "sectionTitlePlaceholder"
    | "editBodyHint"
    | "bodyJsonPlaceholder"
    | "editPost"
    | "deletePost"
    | "deleteComment"
    | "confirmDelete"
    | "cancel"
    | "save"
    | "saving"
    | "postComment"
    | "posting"
    | "commentPlaceholder"
    | "signInToComment"
    | "submitBtn"
    | "submitting"
    | "adminOnly"
    | "loading"
    | "errNoTitle"
    | "errGeneric",
    string
  >;
  blog: Record<
    | "badge"
    | "title"
    | "subtitle"
    | "featured"
    | "newPost"
    | "newPostTitle"
    | "empty"
    | "comments"
    | "commentsTitle"
    | "noComments"
    | "notFound"
    | "backList"
    | "breadHome"
    | "tocTitle"
    | "sections"
    | "titleLabel"
    | "titlePlaceholder"
    | "excerptLabel"
    | "excerptPlaceholder"
    | "coverUrlLabel"
    | "contentLabel"
    | "textPlaceholder"
    | "sectionTitlePlaceholder"
    | "editBodyHint"
    | "bodyJsonPlaceholder"
    | "editPost"
    | "deletePost"
    | "deleteComment"
    | "confirmDelete"
    | "cancel"
    | "save"
    | "saving"
    | "postComment"
    | "posting"
    | "commentPlaceholder"
    | "signInToComment"
    | "submitBtn"
    | "submitting"
    | "adminOnly"
    | "loading"
    | "errNoTitle"
    | "errGeneric"
    | "tagsLabel"
    | "filterAll",
    string
  >;
};

export const MESSAGES: Record<Locale, Schema> = {
  en: {
    // ─── Navbar ───────────────────────────────────────────────────────────
    nav: {
      home: "Home",
      games: "Games",
      forums: "Forums",
      tunes: "Tunes",
      calculator: "Calculator",
      guideline: "Guideline",
      blog: "Blog",
      search: "Search tunes, cars, or tuners...",
      signIn: "Sign in",
      register: "Register",
      profile: "Profile",
      myTunes: "My Tunes",
      savedTunes: "Saved Tunes",
      settings: "Settings",
      signOut: "Sign out",
      soon: "SOON",
    },
    // ─── Footer ───────────────────────────────────────────────────────────
    footer: {
      tagline: "Community platform for sharing and finding tune settings",
      platformTitle: "Platform",
      gamesTitle: "Games",
      contactTitle: "Contact",
      browseTunes: "Browse Tunes",
      tuneCalculator: "Tune Calculator",
      forums: "Forums",
      uploadTune: "Upload Tune",
      discord: "Discord Community",
      facebook: "Facebook Page",
      reportBug: "Report a Bug",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      copyright: "Built with ❤ for the racing community",
    },
    // ─── Auth pages ───────────────────────────────────────────────────────
    auth: {
      loginTitle: "Sign in",
      forgotTitle: "Reset password",
      changeTitle: "Change password",
      tabLogin: "Sign in",
      tabForgot: "Forgot password",
      tabChange: "Change",
      email: "Email",
      password: "Password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      oldPassword: "Current password",
      signInButton: "Sign in →",
      signingIn: "Signing in...",
      resetButton: "Reset password →",
      resetting: "Resetting...",
      changeButton: "Change password →",
      changing: "Changing...",
      noAccount: "No account yet?",
      signUp: "Sign up",
      hasAccount: "Already have an account?",
      forgotHint: "Enter your registered email and set a new password",
      changeHint: "You must be logged in to change your password",
      strengthEasy: "Easy to guess",
      strengthMedium: "Medium",
      strengthStrong: "Strong",
      registerTitle: "Sign up",
      registerSubtitle: "Join the tuner community and share your setup",
      username: "Username",
      usernamePlaceholder: "e.g., yourname",
      usernameHint: "This will be shown on your tune pages",
      usernameChecking: "Checking...",
      gender: "Gender",
      male: "Male",
      female: "Female",
      unspecified: "Prefer not to say",
      country: "Country",
      countryNone: "— Not specified —",
      birthday: "Birthday",
      birthdayHint: "Optional — shown on profile only",
      uploadAvatar: "Upload avatar",
      registerButton: "Sign up →",
      registering: "Signing up...",
      required: "Required",
      errInvalidCred: "Invalid email or password",
      errEmailNotConfirmed: "Please confirm your email first",
      errTooManyReq: "Too many attempts — please wait a moment",
      errFillEmailPw: "Please enter email and password",
      errFillEmail: "Please enter email",
      errPwMin8: "Password must be at least 8 characters",
      errPwMismatch: "Passwords do not match",
      errFillAll: "Please fill in all fields",
      errPwSame: "New password must differ from old password",
      errInvalidEmail: "Invalid email format",
      errUsernameMin3: "Username must be at least 3 characters",
      errUsernameTaken: "Username is already taken",
      errFillUsername: "Please enter a username",
      errAvatarSize: "File size must not exceed 2MB",
      errGeneric: "An error occurred",
      okResetDone: "Password reset successful — back to sign in",
      okChangeDone: "Password changed successfully!",
      pwMatch: "Passwords match",
      pwNoMatch: "Passwords do not match",
    },
    // ─── Home page ────────────────────────────────────────────────────────
    home: {
      badge: "Community Tuning Platform",
      heroTitle: "Share your tunes",
      heroTitleAt: "at Tunix",
      heroDesc:
        "Tunix is your hub for racing game tune settings — whether it's Forza Horizon, The Crew Motorfest, or Need for Speed. Find, share, and perfect your setup.",
      browseTunes: "Browse Tunes →",
      uploadTune: "Upload Your Tune",
      statTunes: "Tunes",
      statTuners: "Tuners",
      statGames: "Games",
      gamesTitle: "Games",
      noTunes: "No tunes yet",
      recentTitle: "Recent Posts",
      viewAll: "View all →",
      noPosts: "No posts yet — ",
      beFirstPost: "be the first to post",
      catAnnouncement: "Announcement",
      catGeneral: "General",
      catReport: "Report",
      statusLive: "LIVE",
      statusSoon: "SOON",
      statusComing: "COMING",
      // Calculator-first landing (share-disabled mode)
      landingBadge: "Forza Horizon Auto-Tune",
      landingHeroTitle: "Instant tune setups for",
      landingHeroTitleAccent: "Forza Horizon 6",
      landingHeroDesc:
        "Enter your car's weight, power, and discipline — get a complete tune in seconds. Free, no signup required.",
      landingCtaCalculate: "Calculate now →",
      landingCtaSecondary: "Read tuning tips",
      landingHowTitle: "How it works",
      landingHow1Title: "1. Enter your car",
      landingHow1Desc:
        "Weight, power, drivetrain, and what you're driving for — road, track, drift, drag.",
      landingHow2Title: "2. Hit calculate",
      landingHow2Desc:
        "Our engine spits out tire pressures, springs, dampers, ARB, aero, gearing, diff — all of it.",
      landingHow3Title: "3. Copy to game",
      landingHow3Desc:
        "Plug the numbers into the in-game tuning screen and hit the track.",
      landingFeaturesTitle: "Why Tunix",
      landingFeatFree: "Completely free",
      landingFeatFreeDesc:
        "No paywall, no premium tiers. Ad-supported so the calc stays open.",
      landingFeatNoLogin: "No signup",
      landingFeatNoLoginDesc: "Open the page, calculate, copy. Zero friction.",
      landingFeatFh6: "Built for FH6",
      landingFeatFh6Desc:
        "Tuned to Forza Horizon 6's physics — also works as a strong starting point for FH5.",
      landingFeatAllDriv: "All drivetrains",
      landingFeatAllDrivDesc:
        "RWD, FWD, AWD — diff outputs adjust automatically. Six disciplines.",
      landingTipsTitle: "Tuning tips & guides",
      landingTipsReadMore: "Read →",
      landingPickGame: "Pick your game",
      landingFh5Tagline:
        "Original FH5 tuning model — torque input, 5 disciplines.",
      landingFh6Tagline:
        "Latest FH6 engine — horsepower input, drag racing, split aero.",
    },
    // ─── Tunes list page ─────────────────────────────────────────────────
    tunes: {
      title: "Browse Tunes",
      pickSub: "Pick a game to browse its tunes",
      pickTitle: "Select a game",
      pickGameSub: "Each game has different tune systems and cars",
      comingSoon: "COMING SOON",
      browseCta: "Browse tunes →",
      backGames: "← All games",
      searchAll: "Search across all games...",
      searchTunes: "Search tunes...",
      results: "results",
      noFound: "No tunes found",
      noFoundTip: "Try a different search term or browse by game",
      shareCtaHighlight: "Have a good tune?",
      shareCtaBody: "Share it with the community",
      shareTune: "+ Publish Tune",
      tryFilters: "Try changing filters or",
      resetAll: "reset all",
      beFirst: "+ Be the first to share a tune",
      prevPage: "← Prev",
      nextPage: "Next →",
      views: "views",
      edited: "edited",
      unknown: "Unknown",
    },
    // ─── Tune detail page ─────────────────────────────────────────────────
    tuneDetail: {
      home: "Home",
      breadTunes: "Tunes",
      featured: "FEATURED",
      by: "by",
      save: "Save",
      saved: "Saved",
      copied: "Copied!",
      copyCode: "Copy Code",
      editTune: "Edit Tune",
      cancel: "Cancel",
      car: "CAR",
      carReadOnly: "— cannot be changed",
      editTitle: "EDIT TUNE",
      titleField: "Title *",
      descField: "Description",
      shareCodeField: "Share Code",
      gameVersionField: "Game Version",
      titlePlaceholder: "Tune title",
      descPlaceholder: "Brief description",
      shareCodePlaceholder: "123 456 789",
      versionPlaceholder: "e.g. 1.0",
      saving: "Saving...",
      saveChanges: "Save Changes",
      stats: "STATS",
      upvotes: "Upvotes",
      views: "Views",
      comments: "Comments",
      version: "Version",
      shareCode: "SHARE CODE",
      links: "LINKS",
      browseTunes: "Browse Tunes",
      shareTune: "+ Share Your Tune",
      tuneCalc: "Tune Calculator",
      commentTitle: "Comments",
      commentPlaceholder: "Leave a comment or feedback...",
      posting: "Posting...",
      postComment: "Post Comment",
      noComments: "No comments yet",
      notFoundTitle: "Tune not found",
      notFoundDesc: "It may have been deleted or the URL is invalid.",
      backTunes: "← Browse Tunes",
      loading: "Loading...",
      titleRequired: "Title is required",
      errGeneric: "An error occurred",
    },
    // ─── Forums page ──────────────────────────────────────────────────────
    forums: {
      title: "Forums",
      subtitle: "Community space for Tunix",
      newPost: "Create Post",
      viewAll: "View all",
      addAnnouncement: "+ Add Announcement",
      catAnnouncement: "Announcements",
      catAnnouncementSub: "Important updates from the team",
      catGeneral: "General Discussion",
      catGeneralSub: "5 latest posts",
      catReports: "Problems & Reports",
      catReportsSub: "bugs, usage issues, content reports",
      emptyAnnouncements: "No announcements yet",
      emptyGeneral: "No posts yet — be the first to start a discussion",
      emptyReports: "No pending reports",
      comments: "comments",
    },
    // ─── Calculator page ──────────────────────────────────────────────────
    calc: {
      title: "Auto Calculator",
      subtitle:
        "Enter car specs → press Calculate → get recommended tune settings (read-only)",
      balanceFront: "Balance Front",
      rearHeavy: "Rear-heavy 30%",
      neutral: "Neutral 50%",
      frontHeavy: "Front-heavy 70%",
      drivetrain: "Drivetrain",
      discipline: "Discipline",
      weight: "Weight",
      power: "Power",
      torque: "Torque",
      calculate: "🧮 Calculate Tune",
      loadingBtn: "Loading...",
      loginBtn: "🔒 Sign in to use",
      loginPromptTitle: "🔒 Sign in required",
      signIn: "Sign in",
      register: "Register",
      noResultHint: 'Enter car specs then press "Calculate Tune"',
      noResultSub: "Results will appear here · all values are read-only",
      gearDragNote:
        "Drag: put top gear at the far right, spread the lower gears evenly, then tune 1st gear on the drag strip.",
      gearNote:
        "Final Drive is calculated from power. Gear ratios still depend on car mods — fine-tune so top gear hits redline at the end of the longest straight.",
      casterNote:
        "FH6 is sensitive to caster above 6.0° — the car may feel snappy on turn-in.",
      warningNote:
        "⚠️ These values are a starting point only. Adjust based on real in-game feedback.",
      rideHeightLowest: "Lowest (Track/Drift)",
      rideHeightLow: "Low (Street)",
      rideHeightMid: "Mid (Rally)",
      rideHeightHigh: "Highest (Offroad)",
      arbNoteAWD: "AWD: Rear slightly higher than Front → easier cornering",
      arbNoteRWD: "RWD: Front high / Rear low → prevents oversteer",
      arbNoteFWD:
        "FWD: Rear higher than Front → pulls tail out, reduces understeer",
      aeroNote: "Drift: Minimum downforce → light tail, easy to slide",
      driftNote: "Drift: Minimum downforce → light tail, easy to slide",
    },
    // ─── Settings page ────────────────────────────────────────────────────
    settings: {
      title: "Settings",
      langTitle: "Language",
      langDesc: "Choose your preferred display language.",
      langUpdated: "Language updated",
      notLoggedIn: "Please",
      logIn: "log in",
      profileTitle: "Profile",
      profileDesc: "Update your username, bio, and avatar.",
      profileLink: "Edit profile →",
      passwordTitle: "Password",
      passwordDesc: "Change your account password.",
      passwordLink: "Change password →",
      signOutTitle: "Sign out",
      signOutDesc: "End your current session.",
      signOut: "Sign out",
      signingOut: "Signing out...",
    },
    // ─── Saved tunes page ─────────────────────────────────────────────────
    saved: {
      title: "Saved Tunes",
      subtitle: "Tunes you've bookmarked for later",
      savedCount: "saved",
      empty: "No saved tunes yet",
      emptyDesc: "Hit the save button on any tune to bookmark it here",
      browseTunes: "Browse Tunes",
      loginError: "Please log in to view your saved tunes.",
      loadError: "Failed to load saved tunes.",
      unsave: "Unsave",
      views: "views",
      savedLabel: "saved",
      edited: "edited",
      comingSoon: "Saved Tunes — Coming Soon",
      comingDesc:
        "We're polishing this feature before rolling it out. For now, you can browse and upvote tunes — bookmarking will be available soon.",
      browseTunesCta: "Browse Tunes →",
      prevPage: "← Prev",
      nextPage: "Next →",
    },
    // ─── Search dropdown ─────────────────────────────────────────────────
    search: {
      hint: "Type to search tunes, users, cars",
      loading: "Searching...",
      noResults: "No matches for",
      groupTunes: "Tunes",
      groupUsers: "Users",
      groupCars: "Cars",
      seeAllTunes: "See all tunes →",
      closeOverlay: "Close search",
    },
    // ─── Profile Card ────────────────────────────────────────────────────
    profileCard: {
      editBtn: "Edit",
      cancelTitle: "Cancel",
      editHeading: "Edit profile",
      changeAvatar: "Change avatar",
      avatarHint: "JPG/PNG max 2MB",
      usernameHint: "Changing your username will redirect to the new URL",
      bioPlaceholder: "Short bio...",
      genderLabel: "Gender",
      genderMale: "Male",
      genderFemale: "Female",
      genderUnspecified: "Unspecified",
      countryLabel: "Country",
      countryNone: "— Not specified —",
      birthdayLabel: "Birthday",
      joinedPrefix: "Joined",
      saveSuccess: "✓ Saved successfully",
      saving: "Saving...",
      saveBtn: "Save",
      cancelBtn: "Cancel",
      errAvatarSize: "Image size must not exceed 2MB",
      errUsernameMin3: "Username must be at least 3 characters",
      errSaveFailed: "Save failed",
      errGeneric: "An error occurred",
    },
    // ─── New Forum Post page ─────────────────────────────────────────────
    newPost: {
      addText: "+ Text",
      addImage: "+ Image",
      textPlaceholder: "Write content here...",
      changeImage: "Change Image",
      uploading: "Uploading...",
      dropHint: "Drop an image or",
      selectFile: "choose a file",
      imageHint: "JPG PNG WebP GIF · max 5 MB",
      errFileType: "Unsupported — only JPG, PNG, WebP, GIF allowed",
      errFileSizePrefix: "File too large (",
      errLoginRequired: "Please sign in",
      errNoTitle: "Please enter a title",
      errNoContent: "Please add at least one text block or image",
      errImageUploading: "Please wait for images to finish uploading",
      errGeneric: "An error occurred",
      errRetry: "An error occurred, please try again",
      pageTitle: "Create Post",
      categoryLabel: "Category",
      catGeneral: "General",
      catGame: "Game",
      catReport: "Report / Issue",
      catAnnouncement: "Announcement",
      gameLabel: "Game",
      selectGame: "Select game (optional)",
      titleLabel: "Title",
      titlePlaceholder: "Post title...",
      contentLabel: "Content",
      maxImagesPrefix: "Max",
      maxImagesSuffix: "images per post",
      cancel: "Cancel",
      submitting: "Saving...",
      submitBtn: "Create Post",
    },
    // ─── Publish Tune page ─────────────────────────────────────────────────
    shareTune: {
      back: "← Back",
      pageTitle: "Share Your Tune",
      changeGame: "Change Game",
      subtitle: "Share your tune setup with the community",
      pickTitle: "Select a game to create a tune for",
      pickSub: "Each game has different tune systems and car lists",
      fh6Note: "Same parameters as FH5",
      carSectionTitle: "Select Car",
      brandLabel: "Brand",
      loadingCars: "⏳ Loading...",
      selectBrand: "-- Select Brand --",
      modelLabel: "Model",
      selectModel: "-- Select Model --",
      selectClassFirst: "⚠ Please select a Class first",
      tiresUnit: "Unit: bar (1.0 – 3.8)",
      included: "Included",
      notIncluded: "Not included",
      gearCountLabel: "Number of Gears",
      speedSuffix: "speed",
      upgradesTitle: "Upgrades",
      upgradesOptional: "optional — list installed upgrades",
      upgradesHint: "Specify upgrades used in this tune (details coming soon)",
      upgradeSoon: "Soon",
      tuneInfoTitle: "Tune Info",
      tuneTitleLabel: "Tune Title *",
      tuneTitlePlaceholder: "e.g. RWD Drift Setup — S1 900 Drift Build",
      tuneDescLabel: "Description (optional)",
      tuneDescPlaceholder:
        "Describe the tune — road conditions, required upgrades...",
      shareCodeLabel: "Share Code (optional)",
      shareCodePlaceholder: "e.g. 123 456 789",
      errNoDiscipline: "Please select a Discipline",
      errNoTitle: "Please enter a Tune title",
      errNoParams:
        "Please enter at least 1 tune value (e.g. tire pressure or suspension)",
      errGeneric: "An error occurred",
      errRetry: "An error occurred, please try again",
      cancelBtn: "Cancel",
      uploading: "⏳ Uploading...",
      submitBtn: "🚀 Publish Tune",
    },
    // ─── Game page ────────────────────────────────────────────────────────
    game: {
      notFound: "Game not found",
      backHome: "← Back to Home",
      comingSoonDesc: "Coming Soon — In development",
      home: "Home",
      brandsLabel: "brands",
      topTunesTitle: "Top Tunes",
      topTunesSub: "Highest upvoted tunes from the community",
      periodWeek: "This Week",
      periodMonth: "This Month",
      periodAll: "All Time",
      topLoading: "Loading...",
      topEmpty: "No tunes in this period — be the first to share!",
      tuneLabTitle: "Tune Lab",
      tuneLabSub: "Calculate tune values from your car specs",
      autoCalcTitle: "Auto Calculator",
      autoCalcDesc:
        "Enter Balance, Drivetrain, Weight and Torque — the system calculates automatically",
      calcBtn: "Calculator →",
      shareTuneTitle: "Share Your Tune",
      shareTuneDesc: "Share your tune setup with the community",
      shareTuneBtn: "Publish Tune →",
      carBrandsTitle: "Car Brands",
      carBrandsSub: "Browse tunes by brand —",
      allTunesTitle: "All Tunes",
      allTunesSub: "All tunes for every discipline",
      allTunesCardPrefix: "All",
      allTunesCardSuffix: "Tunes",
      allTunesCardDesc:
        "Search, filter and sort community tunes — by discipline, class, drivetrain and more",
      allTunesBtn: "View All Tunes →",
      subtitleFH5: "Mexico Open World · 500+ Cars",
      subtitleFH6: "Open World · 500+ Cars",
      subtitleNFS: "Lakeshore City · Street Racing",
    },
    // ─── Titles (user achievement badges) ───────────────────────────────
    titles: {
      sectionHeader: "Titles Earned",
      noTitles: "No titles yet — share your first tune!",
      newcomer: "Newcomer",
      newcomerDesc: "General member",
      firstTune: "First Step Tuner",
      firstTuneDesc: "Shared first tune",
      tuner10: "Apprentice Tuner",
      tuner10Desc: "Shared 10 tunes",
      tuner30: "Pro Tuner",
      tuner30Desc: "Shared 30 tunes",
      tuner100: "Master Tuner",
      tuner100Desc: "Shared 100 tunes",
      liked10: "Eye-Catcher",
      liked10Desc: "Received 10 upvotes total",
      liked50: "Top-Tier Tune",
      liked50Desc: "Received 50 upvotes total",
      liked100: "Setup King",
      liked100Desc: "Received 100 upvotes total",
    },
    // ─── Profile Page ────────────────────────────────────────────────────
    profilePage: {
      notFoundPrefix: "User not found:",
      backHome: "← Back to Home",
      statTunes: "All Tunes",
      statUpvotes: "Upvotes",
      statViews: "Total Views",
      statTitles: "Titles",
      tunesByGame: "Tunes by Game",
      allTunesPrefix: "All Tunes by",
      noTunes: "No tunes shared yet",
      shareFirstTune: "+ Share your first tune →",
      viewAllInGame: "View all in this game →",
      edited: "edited",
    },
    // ─── Guideline page ──────────────────────────────────────────────────
    guideline: {
      badge: "Guideline",
      title: "Guideline",
      subtitle: "Step-by-step guides for tuning and using Tunix",
      newPost: "New Post",
      newPostTitle: "New Guideline Post",
      empty: "No guides yet",
      comments: "comments",
      commentsTitle: "Comments",
      noComments: "No comments yet — be the first",
      notFound: "Post not found",
      backList: "Back to Guideline",
      breadHome: "Home",
      tocTitle: "Contents",
      sections: "sections",
      titleLabel: "Title",
      titlePlaceholder: "Guide title...",
      excerptLabel: "Excerpt",
      excerptPlaceholder: "Short summary shown on listing...",
      coverUrlLabel: "Cover Image URL",
      contentLabel: "Content",
      textPlaceholder: "Write guide content here...",
      sectionTitlePlaceholder:
        "Section title (appears in Table of Contents)...",
      editBodyHint:
        "Body is stored as JSON blocks (text/image/section). Edit raw JSON.",
      bodyJsonPlaceholder:
        '[{"type":"section","title":"Introduction"},{"type":"text","content":"..."}]',
      editPost: "Edit",
      deletePost: "Delete",
      deleteComment: "Delete",
      confirmDelete: "Delete this post?",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      postComment: "Post",
      posting: "Posting...",
      commentPlaceholder: "Leave a comment...",
      signInToComment: "Sign in to comment",
      submitBtn: "Publish Guide",
      submitting: "Publishing...",
      adminOnly: "Admin access required.",
      loading: "Loading...",
      errNoTitle: "Please enter a title",
      errGeneric: "An error occurred",
    },
    // ─── Blog page ───────────────────────────────────────────────────────
    blog: {
      badge: "Blog",
      title: "Blog",
      subtitle: "News, updates, and stories from the Tunix team",
      featured: "FEATURED",
      newPost: "New Post",
      newPostTitle: "New Blog Post",
      empty: "No posts yet",
      comments: "comments",
      commentsTitle: "Comments",
      noComments: "No comments yet — be the first",
      notFound: "Post not found",
      backList: "Back to Blog",
      breadHome: "Home",
      tocTitle: "Contents",
      sections: "sections",
      titleLabel: "Title",
      titlePlaceholder: "Blog post title...",
      excerptLabel: "Excerpt",
      excerptPlaceholder: "Short summary shown on listing...",
      coverUrlLabel: "Cover Image URL",
      contentLabel: "Content",
      textPlaceholder: "Write content here...",
      sectionTitlePlaceholder:
        "Section title (appears in Table of Contents)...",
      editBodyHint:
        "Body is stored as JSON blocks (text/image/section). Edit raw JSON.",
      bodyJsonPlaceholder:
        '[{"type":"section","title":"Introduction"},{"type":"text","content":"..."}]',
      editPost: "Edit",
      deletePost: "Delete",
      deleteComment: "Delete",
      confirmDelete: "Delete this post?",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      postComment: "Post",
      posting: "Posting...",
      commentPlaceholder: "Leave a comment...",
      signInToComment: "Sign in to comment",
      submitBtn: "Publish Post",
      submitting: "Publishing...",
      adminOnly: "Admin access required.",
      loading: "Loading...",
      errNoTitle: "Please enter a title",
      errGeneric: "An error occurred",
      tagsLabel: "Tags",
      filterAll: "All",
    },
  },

  // ─── Thai ─────────────────────────────────────────────────────────────────
  th: {
    nav: {
      home: "หน้าแรก",
      games: "เกม",
      forums: "ฟอรั่ม",
      tunes: "Tune",
      calculator: "เครื่องคำนวณ",
      guideline: "คู่มือ",
      blog: "บล็อก",
      search: "ค้นหา tune, รถ, หรือ tuner...",
      signIn: "เข้าสู่ระบบ",
      register: "สมัครสมาชิก",
      profile: "โปรไฟล์",
      myTunes: "Tune ของฉัน",
      savedTunes: "Tune ที่บันทึก",
      settings: "ตั้งค่า",
      signOut: "ออกจากระบบ",
      soon: "เร็วๆ นี้",
    },
    footer: {
      tagline: "Community platform สำหรับแชร์และค้นหา tune setting",
      platformTitle: "แพลตฟอร์ม",
      gamesTitle: "เกม",
      contactTitle: "ติดต่อ",
      browseTunes: "ดู Tune ทั้งหมด",
      tuneCalculator: "เครื่องคำนวณ Tune",
      forums: "ฟอรั่ม",
      uploadTune: "อัปโหลด Tune",
      discord: "Discord Community",
      facebook: "Facebook Page",
      reportBug: "แจ้งบั๊ก",
      privacy: "นโยบายความเป็นส่วนตัว",
      terms: "ข้อกำหนดการให้บริการ",
      copyright: "สร้างด้วย ❤ เพื่อชุมชนนักแข่ง",
    },
    auth: {
      loginTitle: "เข้าสู่ระบบ",
      forgotTitle: "รีเซ็ตรหัสผ่าน",
      changeTitle: "เปลี่ยนรหัสผ่าน",
      tabLogin: "เข้าสู่ระบบ",
      tabForgot: "ลืมรหัสผ่าน",
      tabChange: "เปลี่ยน",
      email: "อีเมล",
      password: "รหัสผ่าน",
      newPassword: "รหัสผ่านใหม่",
      confirmPassword: "ยืนยันรหัสผ่านใหม่",
      oldPassword: "รหัสผ่านเดิม",
      signInButton: "เข้าสู่ระบบ →",
      signingIn: "กำลังเข้าสู่ระบบ...",
      resetButton: "รีเซ็ตรหัสผ่าน →",
      resetting: "กำลังรีเซ็ต...",
      changeButton: "เปลี่ยนรหัสผ่าน →",
      changing: "กำลังเปลี่ยน...",
      noAccount: "ยังไม่มีบัญชี?",
      signUp: "สมัครสมาชิก",
      hasAccount: "มีบัญชีแล้ว?",
      forgotHint: "กรอก email ที่ใช้สมัคร และ password ใหม่ที่ต้องการตั้ง",
      changeHint: "ต้องเข้าสู่ระบบก่อนถึงจะเปลี่ยนรหัสผ่านได้",
      strengthEasy: "คาดเดาง่าย",
      strengthMedium: "ปานกลาง",
      strengthStrong: "คาดเดายาก",
      registerTitle: "สมัครสมาชิก",
      registerSubtitle: "เข้าร่วมชุมชน tuner และแชร์ setup ของคุณ",
      username: "ชื่อผู้ใช้",
      usernamePlaceholder: "เช่น yourname",
      usernameHint: "ชื่อนี้จะแสดงในหน้า tune ของคุณ",
      usernameChecking: "กำลังตรวจสอบ...",
      gender: "เพศ",
      male: "ชาย",
      female: "หญิง",
      unspecified: "ไม่ระบุ",
      country: "ประเทศ",
      countryNone: "— ไม่ระบุ —",
      birthday: "วันเกิด",
      birthdayHint: "ไม่บังคับ — ใช้แสดงบนโปรไฟล์เท่านั้น",
      uploadAvatar: "อัปโหลดรูปโปรไฟล์",
      registerButton: "สมัครสมาชิก →",
      registering: "กำลังสมัคร...",
      required: "จำเป็น",
      errInvalidCred: "email หรือ password ไม่ถูกต้อง",
      errEmailNotConfirmed: "กรุณายืนยัน email ก่อน",
      errTooManyReq: "ลองเข้าสู่ระบบบ่อยเกินไป รอสักครู่แล้วลองใหม่",
      errFillEmailPw: "กรุณากรอก email และ password",
      errFillEmail: "กรุณากรอก email",
      errPwMin8: "password ต้องมีอย่างน้อย 8 ตัวอักษร",
      errPwMismatch: "password ทั้งสองช่องไม่ตรงกัน",
      errFillAll: "กรุณากรอกข้อมูลให้ครบ",
      errPwSame: "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม",
      errInvalidEmail: "รูปแบบ email ไม่ถูกต้อง",
      errUsernameMin3: "username ต้องมีอย่างน้อย 3 ตัวอักษร",
      errUsernameTaken: "username นี้ถูกใช้ไปแล้ว",
      errFillUsername: "กรุณากรอก username",
      errAvatarSize: "ขนาดไฟล์ต้องไม่เกิน 2MB",
      errGeneric: "เกิดข้อผิดพลาด",
      okResetDone: "เปลี่ยนรหัสผ่านสำเร็จแล้ว — กลับไปเข้าสู่ระบบได้เลย",
      okChangeDone: "เปลี่ยนรหัสผ่านสำเร็จแล้ว!",
      pwMatch: "password ตรงกัน",
      pwNoMatch: "password ไม่ตรงกัน",
    },
    home: {
      badge: "แพลตฟอร์มแชร์ Tune",
      heroTitle: "แบ่งปัน tune ของคุณ",
      heroTitleAt: "ได้ที่ Tunix",
      heroDesc:
        "Tunix คือแหล่งรวม tune setting สำหรับคอเกม arcade racing ไม่ว่าจะเป็น Forza Horizon, The Crew Motorfest หรือ Need for Speed — ค้นหา หรือ แชร์ tune ของคุณให้คนอื่นได้ลองกัน!",
      browseTunes: "ดู Tune ทั้งหมด →",
      uploadTune: "อัปโหลด Tune ของคุณ",
      statTunes: "Tune",
      statTuners: "ผู้ใช้",
      statGames: "เกม",
      gamesTitle: "เกม",
      noTunes: "ยังไม่มี tune",
      recentTitle: "กระทู้ล่าสุด",
      viewAll: "ดูทั้งหมด →",
      noPosts: "ยังไม่มีกระทู้ — ",
      beFirstPost: "เป็นคนแรกที่โพสต์",
      catAnnouncement: "ประกาศ",
      catGeneral: "ทั่วไป",
      catReport: "รายงาน",
      statusLive: "LIVE",
      statusSoon: "SOON",
      statusComing: "COMING",
      // Calculator-first landing (share-disabled mode)
      landingBadge: "เครื่องคำนวณ Tune อัตโนมัติ Forza Horizon",
      landingHeroTitle: "ตั้งค่า tune ทันใจ สำหรับ",
      landingHeroTitleAccent: "Forza Horizon 6",
      landingHeroDesc:
        "กรอกน้ำหนัก แรงม้า และสไตล์การขับ — รับชุดตั้งค่า tune เต็มรูปแบบในไม่กี่วินาที. ฟรี ไม่ต้องสมัครสมาชิก.",
      landingCtaCalculate: "เริ่มคำนวณ →",
      landingCtaSecondary: "อ่านคู่มือการตั้ง tune",
      landingHowTitle: "ใช้งานยังไง",
      landingHow1Title: "1. กรอกข้อมูลรถ",
      landingHow1Desc:
        "น้ำหนัก แรงม้า ระบบขับเคลื่อน และแนวการขับ — Street, Track, Drift, Drag ฯลฯ",
      landingHow2Title: "2. กดคำนวณ",
      landingHow2Desc:
        "ระบบจะคำนวณค่ายาง สปริง โช้ค เหล็กกันโคลง ปีก เกียร์ และ Differential ให้พร้อม",
      landingHow3Title: "3. ใส่ค่าในเกม",
      landingHow3Desc: "เปิดหน้า tuning ในเกม ใส่ค่าตามที่ได้ แล้วลงสนามได้เลย",
      landingFeaturesTitle: "ทำไมต้อง Tunix",
      landingFeatFree: "ใช้ฟรี",
      landingFeatFreeDesc: "ไม่มี paywall ไม่มีระดับ premium อยู่ได้ด้วยโฆษณา",
      landingFeatNoLogin: "ไม่ต้องสมัครสมาชิก",
      landingFeatNoLoginDesc:
        "เปิดหน้า กรอก คำนวณ คัดลอก — ไม่มีขั้นตอนซับซ้อน",
      landingFeatFh6: "ออกแบบสำหรับ FH6",
      landingFeatFh6Desc:
        "ปรับให้เข้ากับฟิสิกส์ของ Forza Horizon 6 — ใช้กับ FH5 ก็เป็นจุดเริ่มต้นที่ดี",
      landingFeatAllDriv: "รองรับทุกระบบขับเคลื่อน",
      landingFeatAllDrivDesc:
        "RWD, FWD, AWD — ค่า Diff ปรับอัตโนมัติ. รองรับ 6 ประเภทการขับ",
      landingTipsTitle: "เคล็ดลับและคู่มือการตั้ง tune",
      landingTipsReadMore: "อ่าน →",
      landingPickGame: "เลือกเกมที่คุณเล่น",
      landingFh5Tagline:
        "เครื่องคำนวณรุ่นเดิมสำหรับ FH5 — กรอกแรงบิด (Nm), 5 ประเภทการขับ",
      landingFh6Tagline:
        "เครื่องคำนวณรุ่นใหม่ FH6 — กรอกแรงม้า (hp), รองรับ Drag, แยก aero หน้า/หลัง",
    },
    tunes: {
      title: "ค้นหา Tune",
      pickSub: "เลือกเกมเพื่อดู tune",
      pickTitle: "เลือกเกมที่ต้องการค้นหา tune",
      pickGameSub: "แต่ละเกมมีระบบ tune และรถที่แตกต่างกัน",
      comingSoon: "เร็วๆ นี้",
      browseCta: "ดู tune →",
      backGames: "← เกมทั้งหมด",
      searchAll: "ค้นหาในทุกเกม...",
      searchTunes: "ค้นหา tune...",
      results: "ผลลัพธ์",
      noFound: "ไม่พบ tune",
      noFoundTip: "ลองคำค้นหาอื่น หรือเลือกดูตามเกม",
      shareCtaHighlight: "มี tune ดีๆ อยู่?",
      shareCtaBody: "แชร์ให้ชุมชนด้วย",
      shareTune: "+ แชร์ Tune",
      tryFilters: "ลองเปลี่ยนตัวกรอง หรือ",
      resetAll: "รีเซ็ตทั้งหมด",
      beFirst: "+ เป็นคนแรกที่แชร์ tune",
      prevPage: "← ก่อนหน้า",
      nextPage: "ถัดไป →",
      views: "วิว",
      edited: "แก้ไข",
      unknown: "ไม่ทราบ",
    },
    tuneDetail: {
      home: "หน้าแรก",
      breadTunes: "Tune",
      featured: "FEATURED",
      by: "โดย",
      save: "บันทึก",
      saved: "บันทึกแล้ว",
      copied: "คัดลอกแล้ว!",
      copyCode: "คัดลอกโค้ด",
      editTune: "แก้ไข Tune",
      cancel: "ยกเลิก",
      car: "รถ",
      carReadOnly: "— ไม่สามารถแก้ไขได้",
      editTitle: "แก้ไข TUNE",
      titleField: "ชื่อ *",
      descField: "คำอธิบาย",
      shareCodeField: "Share Code",
      gameVersionField: "เวอร์ชันเกม",
      titlePlaceholder: "ชื่อ tune",
      descPlaceholder: "คำอธิบายสั้นๆ",
      shareCodePlaceholder: "123 456 789",
      versionPlaceholder: "เช่น 1.0",
      saving: "กำลังบันทึก...",
      saveChanges: "บันทึกการเปลี่ยนแปลง",
      stats: "สถิติ",
      upvotes: "โหวต",
      views: "วิว",
      comments: "ความคิดเห็น",
      version: "เวอร์ชัน",
      shareCode: "Share Code",
      links: "ลิงก์",
      browseTunes: "ดู Tune ทั้งหมด",
      shareTune: "+ แชร์ Tune ของคุณ",
      tuneCalc: "เครื่องคำนวณ Tune",
      commentTitle: "ความคิดเห็น",
      commentPlaceholder: "แสดงความคิดเห็น...",
      posting: "กำลังโพสต์...",
      postComment: "โพสต์",
      noComments: "ยังไม่มีความคิดเห็น",
      notFoundTitle: "ไม่พบ tune",
      notFoundDesc: "อาจถูกลบไปแล้ว หรือ URL ไม่ถูกต้อง",
      backTunes: "← ดู Tune ทั้งหมด",
      loading: "กำลังโหลด...",
      titleRequired: "กรุณากรอกชื่อ",
      errGeneric: "เกิดข้อผิดพลาด",
    },
    forums: {
      title: "ฟอรั่ม",
      subtitle: "พื้นที่พูดคุยสำหรับชุมชน Tunix",
      newPost: "สร้าง Post",
      viewAll: "ดูทั้งหมด",
      addAnnouncement: "+ เพิ่มประกาศ",
      catAnnouncement: "ประกาศ",
      catAnnouncementSub: "ข้อมูลสำคัญจากทีมงาน",
      catGeneral: "พูดคุยทั่วไป",
      catGeneralSub: "5 กระทู้ล่าสุด",
      catReports: "ปัญหาและรายงาน",
      catReportsSub: "bug, ปัญหาการใช้งาน, รายงานเนื้อหาไม่เหมาะสม",
      emptyAnnouncements: "ยังไม่มีประกาศ",
      emptyGeneral: "ยังไม่มีกระทู้ — เป็นคนแรกที่เริ่มพูดคุย",
      emptyReports: "ไม่มีรายงานที่ค้างอยู่",
      comments: "ความคิดเห็น",
    },
    calc: {
      title: "เครื่องคำนวณ Tune อัตโนมัติ",
      subtitle:
        "กรอกข้อมูลรถ → กด คำนวณ → รับค่า tune setting ที่แนะนำ (read-only)",
      balanceFront: "น้ำหนักด้านหน้า",
      rearHeavy: "หนักด้านหลัง 30%",
      neutral: "กลาง 50%",
      frontHeavy: "หนักด้านหน้า 70%",
      drivetrain: "ระบบขับเคลื่อน",
      discipline: "ประเภทการใช้งาน",
      weight: "น้ำหนัก",
      power: "กำลังเครื่อง",
      torque: "แรงบิด",
      calculate: "🧮 คำนวณ Tune",
      loadingBtn: "กำลังโหลด...",
      loginBtn: "🔒 เข้าสู่ระบบเพื่อใช้งาน",
      loginPromptTitle: "🔒 ต้องเข้าสู่ระบบก่อนใช้งาน",
      signIn: "เข้าสู่ระบบ",
      register: "สมัครสมาชิก",
      noResultHint: 'กรอกข้อมูลแล้วกด "คำนวณ Tune"',
      noResultSub: "ผลลัพธ์จะแสดงที่นี่ · ค่าทั้งหมดเป็น read-only",
      gearDragNote:
        "Drag: ดัน top gear ไปขวาสุด ไล่ gear ล่างให้กระจายเท่าๆ กัน แล้วจูน 1st gear บน drag strip",
      gearNote:
        "Final Drive คำนวณจากกำลังเครื่อง ส่วน Gear Ratio ยังขึ้นกับของแต่งของรถ — ปรับให้ top gear แตะ redline พอดีที่ปลายทางตรงที่ยาวที่สุด",
      casterNote:
        "FH6 ไวต่อ caster ที่เกิน 6.0° — รถอาจรู้สึก snappy ตอน turn-in",
      warningNote:
        "⚠️ ค่าเหล่านี้เป็นจุดเริ่มต้นเท่านั้น ควรปรับตาม feedback จากการขับจริงในเกม",
      rideHeightLowest: "ต่ำสุด (Track/Drift)",
      rideHeightLow: "ต่ำ (Street)",
      rideHeightMid: "กลาง (Rally)",
      rideHeightHigh: "สูงสุด (Offroad)",
      arbNoteAWD: "AWD: Rear สูงกว่า Front เล็กน้อย → เข้าโค้งง่าย",
      arbNoteRWD: "RWD: Front สูง / Rear ต่ำ → ป้องกัน Oversteer",
      arbNoteFWD: "FWD: Rear สูงกว่า Front → ดึงท้ายออก ลด Understeer",
      aeroNote: "Drift: Downforce ต่ำสุด → ท้ายเบา เลื่อนได้ง่าย",
      driftNote: "Drift: Downforce ต่ำสุด → ท้ายเบา เลื่อนได้ง่าย",
    },
    settings: {
      title: "ตั้งค่า",
      langTitle: "ภาษา",
      langDesc: "เลือกภาษาที่ต้องการแสดง",
      langUpdated: "อัปเดตภาษาแล้ว",
      notLoggedIn: "กรุณา",
      logIn: "เข้าสู่ระบบ",
      profileTitle: "โปรไฟล์",
      profileDesc: "แก้ไขชื่อผู้ใช้ ประวัติ และรูปโปรไฟล์",
      profileLink: "แก้ไขโปรไฟล์ →",
      passwordTitle: "รหัสผ่าน",
      passwordDesc: "เปลี่ยนรหัสผ่านของบัญชี",
      passwordLink: "เปลี่ยนรหัสผ่าน →",
      signOutTitle: "ออกจากระบบ",
      signOutDesc: "สิ้นสุดเซสชันปัจจุบัน",
      signOut: "ออกจากระบบ",
      signingOut: "กำลังออกจากระบบ...",
    },
    saved: {
      title: "Tune ที่บันทึก",
      subtitle: "Tune ที่คุณบันทึกไว้สำหรับดูภายหลัง",
      savedCount: "บันทึก",
      empty: "ยังไม่มี tune ที่บันทึก",
      emptyDesc: "กด save บน tune ใดก็ได้เพื่อบันทึกไว้ที่นี่",
      browseTunes: "ดู Tune ทั้งหมด",
      loginError: "กรุณาเข้าสู่ระบบเพื่อดู tune ที่บันทึก",
      loadError: "ไม่สามารถโหลด tune ที่บันทึกได้",
      unsave: "ยกเลิกบันทึก",
      views: "วิว",
      savedLabel: "บันทึก",
      edited: "แก้ไข",
      comingSoon: "Tune ที่บันทึก — เร็วๆ นี้",
      comingDesc:
        "เรากำลังปรับปรุงฟีเจอร์นี้ก่อนเปิดตัว ตอนนี้คุณสามารถดู tune และโหวตได้ — ระบบบันทึกจะมีให้ใช้เร็วๆ นี้",
      browseTunesCta: "ดู Tune ทั้งหมด →",
      prevPage: "← ก่อนหน้า",
      nextPage: "ถัดไป →",
    },
    // ─── Search dropdown ─────────────────────────────────────────────────
    search: {
      hint: "พิมพ์เพื่อค้นหา tunes, users, cars",
      loading: "กำลังค้นหา...",
      noResults: "ไม่พบผลลัพธ์สำหรับ",
      groupTunes: "Tunes",
      groupUsers: "Users",
      groupCars: "Cars",
      seeAllTunes: "ดู Tunes ทั้งหมด →",
      closeOverlay: "ปิดการค้นหา",
    },
    // ─── Profile Card ────────────────────────────────────────────────────
    profileCard: {
      editBtn: "แก้ไข",
      cancelTitle: "ยกเลิก",
      editHeading: "แก้ไขข้อมูลส่วนตัว",
      changeAvatar: "เปลี่ยนรูปโปรไฟล์",
      avatarHint: "JPG/PNG ไม่เกิน 2MB",
      usernameHint: "ถ้าเปลี่ยน username จะถูก redirect ไปที่ URL ใหม่",
      bioPlaceholder: "แนะนำตัวสั้นๆ...",
      genderLabel: "เพศ",
      genderMale: "ชาย",
      genderFemale: "หญิง",
      genderUnspecified: "ไม่ระบุ",
      countryLabel: "ประเทศ",
      countryNone: "— ไม่ระบุ —",
      birthdayLabel: "วันเกิด",
      joinedPrefix: "เข้าร่วมปี",
      saveSuccess: "✓ บันทึกสำเร็จ",
      saving: "กำลังบันทึก...",
      saveBtn: "บันทึก",
      cancelBtn: "ยกเลิก",
      errAvatarSize: "ขนาดรูปต้องไม่เกิน 2MB",
      errUsernameMin3: "Username ต้องมีอย่างน้อย 3 ตัวอักษร",
      errSaveFailed: "บันทึกไม่สำเร็จ",
      errGeneric: "เกิดข้อผิดพลาด",
    },
    // ─── New Forum Post page ─────────────────────────────────────────────
    newPost: {
      addText: "+ ข้อความ",
      addImage: "+ รูปภาพ",
      textPlaceholder: "เขียนเนื้อหาที่นี่...",
      changeImage: "เปลี่ยนรูป",
      uploading: "กำลังอัปโหลด...",
      dropHint: "วางรูปหรือ",
      selectFile: "เลือกไฟล์",
      imageHint: "JPG PNG WebP GIF · สูงสุด 5 MB",
      errFileType: "ไม่รองรับ — ใช้ได้เฉพาะ JPG, PNG, WebP, GIF",
      errFileSizePrefix: "ใหญ่เกิน 5 MB (",
      errLoginRequired: "กรุณาเข้าสู่ระบบ",
      errNoTitle: "กรุณาใส่หัวข้อ",
      errNoContent: "กรุณาใส่เนื้อหาหรือรูปภาพอย่างน้อยหนึ่งรายการ",
      errImageUploading: "รอรูปภาพอัปโหลดเสร็จก่อน",
      errGeneric: "เกิดข้อผิดพลาด",
      errRetry: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      pageTitle: "สร้าง Post",
      categoryLabel: "หมวดหมู่",
      catGeneral: "ทั่วไป",
      catGame: "เกม",
      catReport: "รายงาน / ปัญหา",
      catAnnouncement: "ประกาศ",
      gameLabel: "เกม",
      selectGame: "เลือกเกม (ไม่บังคับ)",
      titleLabel: "หัวข้อ",
      titlePlaceholder: "หัวข้อของ post...",
      contentLabel: "เนื้อหา",
      maxImagesPrefix: "ใส่รูปได้สูงสุด",
      maxImagesSuffix: "รูปต่อ post",
      cancel: "ยกเลิก",
      submitting: "กำลังบันทึก...",
      submitBtn: "สร้าง Post",
    },
    // ─── Publish Tune page ─────────────────────────────────────────────────
    shareTune: {
      back: "← กลับ",
      pageTitle: "แชร์ Tune ของคุณ",
      changeGame: "เปลี่ยนเกม",
      subtitle: "แบ่งปัน tune setup ของคุณให้กับชุมชน",
      pickTitle: "เลือกเกมที่ต้องการสร้าง tune",
      pickSub: "แต่ละเกมมีระบบ tune และรายการรถที่แตกต่างกัน",
      fh6Note: "ใช้ค่า tune เดียวกับ FH5",
      carSectionTitle: "เลือกรถ",
      brandLabel: "Brand",
      loadingCars: "⏳ กำลังโหลด...",
      selectBrand: "-- เลือก Brand --",
      modelLabel: "รุ่น",
      selectModel: "-- เลือกรุ่น --",
      selectClassFirst: "⚠ กรุณาเลือก Class ก่อน",
      tiresUnit: "หน่วย: bar (1.0 – 3.8)",
      included: "ใส่มาด้วย",
      notIncluded: "ไม่ได้ใส่",
      gearCountLabel: "จำนวนเกียร์",
      speedSuffix: "สปีด",
      upgradesTitle: "Upgrades",
      upgradesOptional: "optional — บอกว่าใส่ของแต่งอะไรมาบ้าง",
      upgradesHint: "ระบุ upgrade ที่ใช้ใน tune นี้ (รายละเอียดเร็วๆ นี้)",
      upgradeSoon: "เร็วๆ นี้",
      tuneInfoTitle: "ข้อมูล Tune",
      tuneTitleLabel: "ชื่อ Tune *",
      tuneTitlePlaceholder: "เช่น: RWD Drift Setup — S1 900 Drift Build",
      tuneDescLabel: "คำอธิบาย (optional)",
      tuneDescPlaceholder:
        "บอกรายละเอียด tune เพิ่มเติม เช่น สภาพถนนที่เหมาะสม, upgrade ที่ต้องใส่...",
      shareCodeLabel: "Share Code (optional)",
      shareCodePlaceholder: "เช่น: 123 456 789",
      errNoDiscipline: "กรุณาเลือก Discipline",
      errNoTitle: "กรุณาใส่ชื่อ Tune",
      errNoParams:
        "กรุณากรอกค่า tune อย่างน้อย 1 ค่า (เช่น ความดันยาง หรือ ค่า suspension)",
      errGeneric: "เกิดข้อผิดพลาด",
      errRetry: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      cancelBtn: "ยกเลิก",
      uploading: "⏳ กำลัง Upload...",
      submitBtn: "🚀 แชร์ Tune",
    },
    // ─── Game page ────────────────────────────────────────────────────────
    game: {
      notFound: "ไม่พบเกมนี้",
      backHome: "← กลับหน้าหลัก",
      comingSoonDesc: "เร็วๆ นี้ — อยู่ระหว่างพัฒนา",
      home: "หน้าแรก",
      brandsLabel: "แบรนด์",
      topTunesTitle: "Top Tunes",
      topTunesSub: "tune ที่ได้รับ upvote สูงสุดในชุมชน",
      periodWeek: "รายอาทิตย์",
      periodMonth: "รายเดือน",
      periodAll: "ตลอดกาล",
      topLoading: "กำลังโหลด...",
      topEmpty: "ยังไม่มี tune ในช่วงนี้ — เป็นคนแรกที่แชร์!",
      tuneLabTitle: "Tune Lab",
      tuneLabSub: "คำนวณค่า tune จากสเปครถของคุณ",
      autoCalcTitle: "Auto Calculator",
      autoCalcDesc:
        "กรอกค่า Balance, Drivetrain, Weight และ Torque ระบบจะคำนวณให้อัตโนมัติ",
      calcBtn: "Calculator →",
      shareTuneTitle: "Share Your Tune",
      shareTuneDesc: "แบ่งปัน tune setup ของคุณให้กับชุมชน",
      shareTuneBtn: "แชร์ Tune →",
      carBrandsTitle: "Car Brands",
      carBrandsSub: "ค้นหา tune ตามยี่ห้อรถ —",
      allTunesTitle: "ดู Tune ทั้งหมด",
      allTunesSub: "รวม tune ทุก discipline",
      allTunesCardPrefix: "Tune ทั้งหมดของ",
      allTunesCardSuffix: "",
      allTunesCardDesc:
        "ค้นหา กรอง และเรียงดู tune จากชุมชน — ตาม discipline, class, drivetrain และอื่นๆ",
      allTunesBtn: "ดู Tune ทั้งหมด →",
      subtitleFH5: "โลกเปิดเม็กซิโก · รถกว่า 500 คัน",
      subtitleFH6: "โลกเปิด · รถกว่า 500 คัน",
      subtitleNFS: "เมือง Lakeshore · การแข่งรถบนถนน",
    },
    // ─── Titles (user achievement badges) ───────────────────────────────
    titles: {
      sectionHeader: "ชื่อ ฉายา ที่ได้รับ",
      noTitles: "ยังไม่มีฉายา — เริ่มแชร์ tune แรกเลย!",
      newcomer: "ผู้เริ่มต้น",
      newcomerDesc: "สมาชิกทั่วไป",
      firstTune: "ช่างจูนก้าวแรก",
      firstTuneDesc: "แชร์ tune ครั้งแรก",
      tuner10: "ช่างจูนฝึกหัด",
      tuner10Desc: "แชร์ tune ครบ 10 ครั้ง",
      tuner30: "ช่างจูนมืออาชีพ",
      tuner30Desc: "แชร์ tune ครบ 30 ครั้ง",
      tuner100: "Master Tuner",
      tuner100Desc: "แชร์ tune ครบ 100 ครั้ง",
      liked10: "Tune เข้าตา",
      liked10Desc: "ได้รับ upvote รวม 10 ครั้ง",
      liked50: "Tune ระดับ TOP",
      liked50Desc: "ได้รับ upvote รวม 50 ครั้ง",
      liked100: "ราชาแห่ง Setup",
      liked100Desc: "ได้รับ upvote รวม 100 ครั้ง",
    },
    // ─── Guideline page ──────────────────────────────────────────────────
    guideline: {
      badge: "คู่มือ",
      title: "คู่มือ",
      subtitle: "คำแนะนำทีละขั้นตอนสำหรับการ tune และใช้งาน Tunix",
      newPost: "สร้างโพสต์",
      newPostTitle: "สร้างโพสต์คู่มือ",
      empty: "ยังไม่มีคู่มือ",
      comments: "ความคิดเห็น",
      commentsTitle: "ความคิดเห็น",
      noComments: "ยังไม่มีความคิดเห็น — เป็นคนแรก",
      notFound: "ไม่พบโพสต์",
      backList: "กลับไปยังคู่มือ",
      breadHome: "หน้าแรก",
      tocTitle: "สารบัญ",
      sections: "หัวข้อ",
      titleLabel: "หัวข้อ",
      titlePlaceholder: "ชื่อคู่มือ...",
      excerptLabel: "บทสรุป",
      excerptPlaceholder: "สรุปสั้นๆ ที่แสดงในหน้ารายการ...",
      coverUrlLabel: "URL รูปปก",
      contentLabel: "เนื้อหา",
      textPlaceholder: "เขียนเนื้อหาคู่มือที่นี่...",
      sectionTitlePlaceholder: "ชื่อหัวข้อ (จะแสดงในสารบัญ)...",
      editBodyHint:
        "เนื้อหาเก็บเป็น JSON blocks (text/image/section) แก้ไข raw JSON",
      bodyJsonPlaceholder:
        '[{"type":"section","title":"เกริ่นนำ"},{"type":"text","content":"..."}]',
      editPost: "แก้ไข",
      deletePost: "ลบ",
      deleteComment: "ลบ",
      confirmDelete: "ลบโพสต์นี้?",
      cancel: "ยกเลิก",
      save: "บันทึก",
      saving: "กำลังบันทึก...",
      postComment: "ส่ง",
      posting: "กำลังส่ง...",
      commentPlaceholder: "แสดงความคิดเห็น...",
      signInToComment: "เข้าสู่ระบบเพื่อแสดงความคิดเห็น",
      submitBtn: "เผยแพร่คู่มือ",
      submitting: "กำลังเผยแพร่...",
      adminOnly: "ต้องมีสิทธิ์แอดมิน",
      loading: "กำลังโหลด...",
      errNoTitle: "กรุณาใส่หัวข้อ",
      errGeneric: "เกิดข้อผิดพลาด",
    },
    // ─── Blog page ───────────────────────────────────────────────────────
    blog: {
      badge: "บล็อก",
      title: "บล็อก",
      subtitle: "ข่าวสาร อัปเดต และเรื่องราวจากทีม Tunix",
      featured: "แนะนำ",
      newPost: "สร้างโพสต์",
      newPostTitle: "สร้างโพสต์บล็อก",
      empty: "ยังไม่มีโพสต์",
      comments: "ความคิดเห็น",
      commentsTitle: "ความคิดเห็น",
      noComments: "ยังไม่มีความคิดเห็น — เป็นคนแรก",
      notFound: "ไม่พบโพสต์",
      backList: "กลับไปยังบล็อก",
      breadHome: "หน้าแรก",
      tocTitle: "สารบัญ",
      sections: "หัวข้อ",
      titleLabel: "หัวข้อ",
      titlePlaceholder: "ชื่อบล็อก...",
      excerptLabel: "บทสรุป",
      excerptPlaceholder: "สรุปสั้นๆ ที่แสดงในหน้ารายการ...",
      coverUrlLabel: "URL รูปปก",
      contentLabel: "เนื้อหา",
      textPlaceholder: "เขียนเนื้อหาที่นี่...",
      sectionTitlePlaceholder: "ชื่อหัวข้อ (จะแสดงในสารบัญ)...",
      editBodyHint:
        "เนื้อหาเก็บเป็น JSON blocks (text/image/section) แก้ไข raw JSON",
      bodyJsonPlaceholder:
        '[{"type":"section","title":"เกริ่นนำ"},{"type":"text","content":"..."}]',
      editPost: "แก้ไข",
      deletePost: "ลบ",
      deleteComment: "ลบ",
      confirmDelete: "ลบโพสต์นี้?",
      cancel: "ยกเลิก",
      save: "บันทึก",
      saving: "กำลังบันทึก...",
      postComment: "ส่ง",
      posting: "กำลังส่ง...",
      commentPlaceholder: "แสดงความคิดเห็น...",
      signInToComment: "เข้าสู่ระบบเพื่อแสดงความคิดเห็น",
      submitBtn: "เผยแพร่โพสต์",
      submitting: "กำลังเผยแพร่...",
      adminOnly: "ต้องมีสิทธิ์แอดมิน",
      loading: "กำลังโหลด...",
      errNoTitle: "กรุณาใส่หัวข้อ",
      errGeneric: "เกิดข้อผิดพลาด",
      tagsLabel: "แท็ก",
      filterAll: "ทั้งหมด",
    },
    // ─── Profile Page ────────────────────────────────────────────────────
    profilePage: {
      notFoundPrefix: "ไม่พบ",
      backHome: "← กลับหน้าแรก",
      statTunes: "Tune ทั้งหมด",
      statUpvotes: "Upvotes รับ",
      statViews: "ยอดวิวรวม",
      statTitles: "ฉายาสะสม",
      tunesByGame: "Tune แยกตามเกม",
      allTunesPrefix: "Tunes ทั้งหมดของ",
      noTunes: "ยังไม่มี tune ที่แชร์",
      shareFirstTune: "+ แชร์ tune แรก →",
      viewAllInGame: "ดูทั้งหมดในเกมนี้ →",
      edited: "แก้ไข",
    },
  },
};

export type Messages = Schema;

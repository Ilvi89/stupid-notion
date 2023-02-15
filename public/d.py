
for ngram_range in get_ngram_range_list(np.arange(2, 6)):
  count_word_vec = CountVectorizer(ngram_range=ngram_range, \
                                   stop_words=stopwords.words("russian"), analyzer="word")
  calc_vec_score(count_word_vec, x_train, x_test, y_train, y_test, vec_score_list)

for ngram_range in get_ngram_range_list(np.arange(2, 6)):
  count_char_vec = CountVectorizer(ngram_range=ngram_range, \
                                   stop_words=stopwords.words("russian"), analyzer="char" )
  calc_vec_score(count_char_vec, x_train, x_test, y_train, y_test, vec_score_list)
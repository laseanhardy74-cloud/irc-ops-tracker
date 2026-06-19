import { useState, useEffect, useRef } from "react";
import { supabase, loadTrackerState, saveTrackerState } from "./supabaseClient.js";

const MRD_PHOTO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAFAAUADASIAAhEBAxEB/8QAHAAAAQUBAQEAAAAAAAAAAAAAAAECAwQFBwYI/8QAPhAAAQMCBAQEAwYFBAICAwAAAQACAwQRBRIhMQYTQVEHImFxMoGRCBQjobHRM0JSYsEVcuHwJIIl8UNTkv/EABoBAQEBAQEBAQAAAAAAAAAAAAABAgMEBQb/xAAnEQEBAAICAgEFAAIDAQAAAAAAAQIRAyEEEjEFEyJBUSMygaGx4f/aAAwDAQACEQMRAD8A+gwEITkAlASJUAhCEAhCEAhCEAhCEAhCECISlIgahKUiAQhCAQhCAQhCAQhCAQhCAQUtkiBEhCdZFkDUJ1kIEQlsjogahKhAiQhOQgcAlCAlAQCEIQCEIQCEIQCEIQCEIQCEIQB2SJSkQIUiUpEAhCEAhCCgEJEoQCEIQKlTUIFKRCEAlSJQgEWQlQJZInIQNsiyWyLIEQlsiyBQlSDdKgEIQgEIQgEIQgEIQgEIQgEIQSgCUiEl0AUiEhKBboum3RdAt0JLoQKEXSXRdAqW6RCBUJEt0AhCUIBCVAQCUIQgLIshCBEJUWQIhLZIUC2QhCAQhCAQhCAQhCAQSi6QoBCS6LoFukukukJQBKQuAGpVbEK2moaOWrq5mQQRNzSSPNg0L598TvFqtxV0mHYCX0mHklhmFxJP8/5R6DVJNpbp1njHxJ4Y4Ze6CqqnVNU3eCmGdwPYnYLknEvj7i0jpI8Hw+nowNnSnmPt69AuR1UkjnPJLnOcLkfEB7nqfmsKomyukLJGucXWJvtr1PX2C16pvb32IeLfHNU8yO4hqIR/RC0NF/oqsHizx1C4GPiGqcf7rE/p+659JuQTnJ3uTYeqYJLE+W9u+qzWsXeeFvtA49TPZHjlHDXwj4pI7Mkt7bH8l3PgfjnAuLqcvwyqaZG2zRO0e33B1Xw5DO7Q2LvlYLVwTHK3BsSjrcPnfT1EZuHtNj7abhc/axu4y/D71zJ11xPw48bKPEoIqXiCN1POBY1DGkscfUDULsdDV09bSx1VJPHPBK3MySNwc1w9CF02wtBCbdLdAqVNShA4JQmhKEDkoSJQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgCkQUIBCS6RAJCUXTXFAEqGpnjggfNNI2OONpc9zjYNA3JTnOXEvtE8YuiazhWhkIc8B9YQdLH4WH9T8kHkfFnxDn4nxN1JRuczCIH2iZe3NcP53d/QdF4ADmtJeXZWm+u5PqopZQ9zRbIMx3G4B1Kkhc2bMAC2IbdiO5XSTTlldsutMkrMkJcyK9iD8Uh9f22Cy6iNkIbcZnncAW1Xo5mBxc/NmvcNHp6dlTFK6UB7IhmJP4j9Mo/wrYsrzhZJ5mkOBadW2sGj1UTyGutmzAdl6J1FCxogDjK/d7WgnromT4HXTD8KjnDd7lu5+a55any6Yy34jBzk20At0J2Twf6cre3qtQ8M4kzzvpX6i+humMwuYGz4/Lcagbe689zx/r0Tjy/hcJqeVLZz3NJ00NrHuut+FHiPiHCs7aWqJqsHmdmfECCYSf5m+/UbdVz7DcBlfLd/mdkuCBvZQgTxgkvy5SQRYCy3x5zJz5cMse6+4sNrqbEKKGspJWywTMD2OadwVZuuCfZl4uke6o4Vrpi4sAkowdrG5c0LvLSujlEgSpoTginJU0JyByAkCUIFQhCAQhCAQhCAQhCAQi6LoBCLougEJChAXSHZF0hKASEoKaSgCVG8pXFQyOQUcfxOnwnCKvEql4bDTROkcSew0HzOi+NuJMSqcaxapxKokBfVTOkc7ewvew/Rd1+0vi5hwCjwaOQh1VJzHtHUN2v8ANfOdc5jZXtDm/htDAxpvqdz9AfqtY/1nI8zOcx8jtGEBrQejen7q7HKG07W9Qdf297fReedWSS112jK2MZQB76/np8ldFTldqA4uNrDb2/wtbZsbRqGTOaxrckDWZ3PtuOnyWtw9g9VjkrHsa6GiBvnAtzPQDt6qrwZgj8drGumFqGJwzjpK8dB/aF2nCKCGCBkcbQ1rRYAaWC8Pk+X6X1x+X0vD8H7k98/hl4VgNJQwNjihYLak2uSfUq2/C4nkkxNufRbojA2CVzATsvmZZW3dfawxmM1I8jXYPE4GzQPkvOYnw/HJq1tndQRo5dEq4hqsyopgbkgHsV5cs7jenpnFjlO48LUQRUlFyS2ziDd21vZc/wAZdyMVy5mmOSwuR17+y6txHRukp3gOs62hK5pjUcczeVLlzs0sdNOoX0vB5N18b6jxesRcMYpLguOU2J00zWz00wktm3AOrfovtjAcSpsXwmmxKkeHw1EbZGntcbe6+Dqpr2lkzTmF97anRfUH2YOIxifB82ESyNdNh0nk11MbtRp6G4X1be3xo7CE4JjSnhFOCcEwJwQPCVNCcgEIQgEIQgEIQgEIQgRCElkBdF0WSIFui6RCASFBKQlAFMKcSmlAxxVeU2U7lVqXBjHPds0XKD5r8esS+9+IckD3Xio4hGBbbS5K5FXn8JzgbyOcXmw1vsB9P8r1nFOIyYvxNjGIiRrufUPy3OliTlA/JeVnsTncw5GNsB3J6n5fqtT4Zvyz42NY1kZ1NrkDcBXsGpqnE8TZSxZg9+l//wBbO/8A3us8Py5nPAHMGunwt9PyXsOB3z4Ux1UacF8pBdnbsOguufLnccbr5deLCZZyZfDqvCmGR0FFDBEwNawWAXr6FmwC8Pg/EsD2DnQhp/sdf9V6/CsRgls6KQOC/P5TOZbyfqMMuPLHWDWewNIHVBjdbZSNLZWteTom1WIUlOMkjwLdAt62z7aU6iO+9ln1DLGwaqWNcVQxZm0sYvbQvXm2YjiWJSkXlLeuXSy55+Nle2sfLwnTZxan5kZsLHsuTcbUIp60uPlc7Yg6H0sulmHFqSPn5HSwD4g54JHssDjrC2YjQ/fKcAkMzAW6p42f2uSbrPlYff47qduUc9shyM8xtqLdl1T7L2Kmi8QxQuNoq+mfGNd3t8zfnoR81xmqkMM+doyuabOHTdeq4FxX/RuLcIxmJzmCGqje+x/luLj2tdfft12/Na3t90MOl1I0qGJzXAOabtOoPopGro5pAnBMCcNkDwnBNCVAqEIQCEIQCEIQCEIQIhJdF0CpCkQgEIQUCHdIUqagRMcnFMcgY4ryvibiYwvg7EKgPDHuj5bSTa19z8hcr1EhsuLfaXxflcPigF28x4Ze+5OrvoAP/wClL8LPlwVpBjkcbnmPuGgdD/n91U4gtBSxU8Lv4pzGw3FtT7XOiikrs+WNrmsB0ce2t3H9AoHTnEKiaqOjI25WgC4b2Htpf5BdJemNDC6ds2JMEjQI2uF77Frdf2XQW8T4OIxFVPa4E2AA/Rc/p2TMjyxsLnuGVoHVbeHcMNqMMkFVBIyrc8Oa83LQ22rSAvNyzG38q9XBllJ+Mb8DqDE7HC6wPde4ZuR9NfyXoOG8RqKWp5NQCHje/VVuG+GXCWeqfDE2uk5ZhqqdvJ5BDbaACxB0vtfXqvR4jRTPFM+phhFUy4kMXwuHQj9l4PK9Jj1X0/Duft+Ueuw2pdJQufc2AuvM8QzTzTWY5wJ02vdeiwEAYS9hvciyp1FGTnLI2mTKQzNoL/svn+2rH07jvGuaY3X0GDv5tdKZJc1uW7r7BZMnHrmeWGncxnTyWA9V7HEeGSY601giqKqqYG85zbui9GDQAf8AbqhScOVcUlQ+QDEfvFM2mBqYh+G1oAGW3awA7L6mF4/Xuvj548vt+MLwxxiyttC5xzOFiDsvSVEEZoHGO3LkFw3sV5jAOAJKSsZPJLIWA3Lb6Fe3rYhFRiMAANGgC+b5d4/b/G+p4U5fX/I+b+KaKaDE6lzmEDmkH0ve35JMNLpKZrb9LD3C2fEmFrcUlyuOZz+mzdOq85hUpY5zQ7Kb3C+5hffjlfneXGYctxfdnhlin+scBYJiBdmfJRxh5v8AzNGU/ovTBcx+zhXtrPDOjYHDNTyyxPF9R5rtP0P5LpgXafDheqlanBRgp4KqHhOTAnBA4ISJQgEIQgEIQgEFCQoGoQhAISXQgCUISXQBSFCQoEKjcnEpjygr1czIYXSPNg0XK+TfH3H5sW4p+7F5dHSNyhnRjnG9vU2tdd+8YeKG8OcLTSNcxtTOOXACdb9Tb0C+PsWqJJ6l8kji98jy5znHUknqs3u6anXbKqXAEjMR3t27LUoY7Qtytc0SOBdr07fksiS0k2QutsXH0W/G/JRULXNs58hfb0Ow+n6rpIxe3SuAcJozSQzCFr5Xtu57xci5XQKfBqR4B+7Rg73DbLy3ATWfdIxpoAF0CkeGsABBK+BzctvJX6fg4JOLGqoo4adnljDT3O6pTNYS5zhcnZXsVqoqeFz5HBZk7o3Yc6XmgyG1gOi82eVr0YYSNPDQRCW30/VXY42ubteyjwGgknpOc97WttfU6p7vIXBsgaCuOcs1a9GGruQ59M17fhDvcXUcdBG0+WBjT6NUlPV8uUMlIJOxHVawMJjzAhejD/V5sprJhzRho2WLi7ssLjYL0lW1jnEAry/EhyUspbqQNAvNllvLT2Y4euG3HfEjDAwCutfmO3vuCFz+G7ZQ9xN7i5/ddU8WaiKLh+mp4gC57hnLhtYE6LlsDA4FwN/Nt/lfo/F39qPyPm2feun0x9kzFmuw/FcGefMx7amK5vdp8rx8iGn5rvjTovmL7NUggqa6qyuL6Z0clmg/w3OLJB9HB3/qvpph6L0z4eRMCngqIFPBVEgTgmApwQPQmgpQgVLdIhAoQkCW6AKRCEDLoSIugVJdJdCAQi6QlAEppQSkKBHKCoe1jC57mtHcmylcVl10TOa+V7Y3uIu3MNrBB89/aAx2Ku4gkgpvxGwQcsSg6DW7rd9rLh1W4ucbC3y0XSvGnEpa3E4qv7uKaJzXNjBdme+xN3H59Oi5m4cx4BcXOOgUi1UYA+drBs74rb2WyKnnzsa4mwLWNt0AFrLPZCYi0EZnu3NtA3/lMY9za1runMHRW2pHaOB8QaIMuYEh1t17yGsHLzE6ALjfCMriQ+NxF3kEfNdDaKnksvfI4aEd18LyOLWdr9L4vPvikaWI/wDyML4y/Lm+EjcLz2J4RisNQyro5+ZIBle3UNeB3F/zUtLjNK2tdTvqIw5mjgXAEH1C36aupn2PPbb5lcJhnvqPXJ7TpDg+I4u6Nkb8MqGEC3xgt+qvz4NJWvZNVzHmMN2taXZWfQi606KakMYeyrgtufNY/RSSVtMHfxm/QplxZSbkbxxyt1YrVFM8UjWB5L2ah57qPDMSe9ropLslYcrmkqeqxGjijc6WeJjQNS54AH1Xnq2Rk746+geH5iG5mm4eFyx9r1Vz1jXo5Z7tJusLHJo2wB8zgI87cxcbC11cjc90YzJrMLosXk+64lEZqU2zRh2XMb+Ubg2v27KYYb5JDl5fXitrl3i9S0EmE0NZHiEksxlLWQNblYGubck31J21Gi53h8AdVMjsSCXC99F13xz4SaaKh4kwYVL8Np5HUsoMueOB9g4ANuclwdtB2XIqKdsFW17s3xFx+a/SePJMJH4/ycvbkt/rtH2dGPGLVcGX+PSyhxuQQW2t+pX0lROcaWIv+Ixtze9hdfNf2Z5HTcSyvlv+HTyltxYXJB/yvpKldeCMjS7R+i7uMW2lPaVC0p7So0mBTgVECngoHgpwUYKddA5LdNRdA9CahAt0FIhAxCS6S6Bboum3SEoHXTSUhKQlApKQlNJTXOQDysvGWtnpXwuBuR5SBse6vPdZed40xdmD4FVYi9hk5TCWsBsXnoFKR8q+LhmdxLK2zy0GzC4a5R0t+XqvGUuXntc8dbC4utTjCrqa7FZK2d45szy7ymzRfXKOwWXSRvdI0Pk0Ju4N3P7JgZdLNYWu1Js4uIBvr63WbEC6VhJNjJeyt4jM3PkFsrRe/f8A7+6q0+Z2Wx1Nt/Xf9VqpHr+E53U1Y6KUZWynPGT+q69g1Syow/lusXDUXXzvidRNSV9NUxucHsYNL6H0XT+CeI46ula9r7O0Dmk6tK+f5fFf9o+r4PPP9a3OLeGKGsq4sSY4U1UHAiZo0Nujh1C9Dw1FgM0TY8TjloZgCM8byY39jcbexAVMTCtoZKd2+7fRUMPllhlySggj6H9lz4uSSar9B4mHFnvHLK43+x0gYBwwYIJIMUkF9Hls2bpr00Ub6PhallBfiFZWD+mPa1u4AXmKadhZYBp93K0wmWzRlaOzTcrrlnjJvb3YeJjh3nz2z/j/AOn4jSYZjHLidh8bYI3B2RxzZiNi4nf22TnQRwlscbQ0XvYDQK5SRiJmosT0UUzc0l187l5Zlenj8j7eWe8J0YbAdF5yk48wCh43GCYhliayzvvbpi1jZLjynoBa+p7rdrC7KY2fFbX0C474qcIVFPhY4rhOaKWqdTzD+ggDKfmnh8WPJydvm/UeXLi4fx/b33jf4h4FJRS4RgX+mVT6oONQ6BznxR6uPlHw31GmtvS9lwukBnmcA2z3C5ubkqvThhDTlzACxJ6qVj3xTwyMBJzbE/Ky+5hhMJ0/M5cnte3aPs21DIOI30mmaRrxe+pu0aW+S+laZ34TP9oXyB4N4oaHjmmY15AnkaIy5wHmB6/K4X1tQTcynY4AgEbHp6Lc7SNBpTwVA12qka5GkwKeCoQU4FFTApwKiBTgUEgKW6jBTgUD0XTbougci6S6LoIyUhKQlISgUlISmkpCUCkppKQlMc5A5zlE56RzlBI9ATSaFc28T8fpnRVPDstHWc5zGvZNy7x3J0trc+tgV7+Zwym5suVeOFQyn4cmlq3scGg8pmXXN79FjLem8dS9vmrHXzx10tMb3icW3toD1Co814dlDrOO5AsEk8zpJjqSS697/qURwvzDVubturL0xbs5rW7ucT6HqrNLHd13eUdeyWlgzPs4akd9AE+rkytAbZoA3t8Xt2C3ti1DjjWvjEtzZr8nyVXBK+rw7EGz05uB8behb2KlrZC+laAW3vewHVbHAmDjEKbGZizNyKa4t8z/AIUykymmsMtWV0PhXHIp+TOx12u0cDuPQr3tNTwyuBADmuF1wHAHz0Uwljvkdo5vQrrHCeNh8bY3v0G1zqF8Xm49XeL9F43Nufk9vBg9G54eRlPoFfjoIoW/h/osylrw5g83RSvxZkbDneAvNcrrt7Z38L84DW+qz55WsI6uOwCoVGNNkcGQgvedgruE0j5ZBLN5nn6BccstO2GO1iCmIp3yPF3O3WpDwjDj3h7imH1LAWV0jiwkfCWgBrh8woqkZbRMFzsB3XUMJw8UeDU9KAPw4gHe/X817fpfH7Z5ZX+f+vmfWOSTjxx/t/8AHwZi2A1uB4pV4JiED46qJ92Zm6OHoeoI2KrwxtkjgDQQ8uNzbay+wPFXw5w7i6gLHtEFbECaapaPMw9j3aey+auK+Dsf4UrY5MSw5whDiDNF5onn+ppH5g2K+1ep2/M5Y2Xp4+Osko8Ua9ji2SJwLe+YL6+8KMfquIeFYa6ppxA8mxs69yNCe4+a+QTBJKTK0Xdc3PVfVfgljGEVnC1HR05aKuCJrJg4AOcQN1MMpa1rVdIYfdStKhaVI0rqqYFOBUIKeCppUoKcCoQU4FRUt04FQ3ShyCYFKCogU4FBIClumAougjumkppKQlA4lNJTSUhKBXOUbnJHOUTnoFkeospdqdkrQZHW6DdSusBYdEk2VQqNZDboNlxL7RtRTw8PNhnMvNmlBjyDQW3uuzV9RHTRz1U8jY4mC5e42AA3JK+UvGDjB3EWKyUjHxmlp5XZJY7kSjofZMuojnQHms1pAO9grtNROe9oNxm2B3+QSYfFFJOA+QsBd0C066krmwEiORkYPmf3CSM2oql1NRQ8ltnSk3MYNyP9x7+izpC+d+V51B/lG3ogROY4cqPO/q46AeqawvFQGtN231cNiVRC5gdK5t9LHcfoureFeFzU/h3xLizIy+U012NDTfKbtv8AIXXOIKbPXtga1xvJYuHv0X0x4cUbuH6yhhdG37pV0jYiNxcXIv73Vk3KOGYZSj7rG0gE5d7Law2CSNwLLghdD8S+AJMHxE4thcF8JnN3tYL8hx6W/p7LIwfDGuOS1rDsvheR7YZar9H4vrnjLFOOt5bAHiTMf6HHVSwGrqnhsMBb/e85iF6KjwSK+d4vZbNBh8TNQ0D5Lx5clr348cilgeEtgaHyeZ53J3K9LTsEcYsFWjbZ2iuAaAWXHTtcl3h2jNdxHSNLbsaeY4f2t1/Wy6kwWFrLxvhnT8yeurXD4S2Bny1P6j6L20j2NNhYuX6D6fx+nDv+vzH1Ll+5z6/irUxh2685xLgVFjGG1GHVseeCYEOGxB7jsQvU2vqUhgjfo5t17csZlNV4ccrjdx8geIvhXjmASS1dJC6sowbiohGoH97RsfXZek8C+FcXp8QhxWqkEUDScoa8HPp6L6RrMPaBmZqDoQVjQ8P01LI59LTtgLiSWM0bc7m2w+S5Y8XrltbqhqeCkdFJGcr2FqAuzJ4KcCmWShVEgKXMo7ouoJQ5KHKIFLdNKmDk4OUIcnByipg5LdRApcyCMlNJTSUhKIcXJjnJrnKNzkUPco2XfIGA7pr3KShIFWGuPmLSQPRBaewRsDW7KCd2Vh9lbl1Xk+M+JaTA+XE85p5BdrACfbbXU7ALXwy8f42YqaPhHM5hfAyQOmaDo/R2Vp9M1r+y+TXvknlsHOc+973XdvGLiWsrsDfhww5wbUNzZnEaNbqTYX7hcJYZZpg2OJ1++XZc73Uy1I9Tw9g8VQ3M886Makjqe1+3ss3GJZfvT2uqyWg6MB2Haymp6PF4aEvqKuop4XC4a3y3/wArMqHNDjduXUg+pW71NOcvaOpqJMuRocGjoevuqkjpXSZ3uJJ1Fj/2ytQwvlJkcCGAhpJ219VO/DZGszl8di0EAOBJ9vVSRbW5wQI5+IoDIwyON3vPQAAa2X1VhdA2r4Qw6VmsscLHNd1uF8seGkkUfFlOyXyNmY+mOYXsXNsD9QF9gcK0op8OipbEWjF2no62o+q3Phccmrglquga2ZjXtc3K9rhcH0IWPi3h7Qve+pwgimlOpid/DPt1H6L0WFRNgeQLWJutthYeot3XPl4cOWayj0cPNnxXeFcdqMKq8PP3esp3xSdLjQ+x6poZkblsL+67DV00NRA6OaJsrD/K5twvH45wnGxv3mgc5rj/APhcdD6A/uvkc/07LHvDuf8Ab7Xj/U8MuuTq/wDTyDW9t1pxYbVyYf8Ae4oxKSSBE03efks+G33+Kmkc6NxkDD5bkG/ZdBw+I1ZqWsnOZovDI2GzvLoWm+2gP5rh4/j45727eV5V4teqrwBzafhmPNGWyyTSuLSLG+a3+F6SmjlPmebkqjhVTS01Py3xFjnAljC4eUXN7n3WrQPjMJkz3YDqbFfb4dTCY/yPgc9uXJll/aljhc7dSiJo3OvYKalEU3xTadA3S/zVm8MYs0NC7fLipGIHodOhUFS1ly1rcwHVX5HtJ0WXVOLqsQMuL6u9AgqTcx3lEedl9bi5AU8VJA2PyNb3uVbawAdgFU5ojqTCdARmZ/kJVQOABtYW9lDLCw65R8tFZlFiT0URPQjRRdM+eIx67juorrSczMCDqCs+ojMbyOnRDRt0uZR3RdVEocnhyrhycHKCcOS5lAHp2ZRSEppKCUwlGQ4qN5SuKhkcjRkj7bp+Jh0E0GIRi4i0eB1ad/3+SpVnMfG9kZs9zTY9lp4c4z4ZGZhq5nmBSTZ8LRla+PMxwIcLhce8Y8IrqrE2VcDamWPlhsjaZ7WysLb2czNoTrsvfx1NRhtYKKWFzqeQ/wDjvDxof6NfyXlfF7FammwGSowcxnEBYtinZZ1v5iAdLpl3E+HzdxnjGJx1TaafEa8mAFrI6mnEL2tOh2Ot/wA1h4NUMiqg6ZzyB0BDfkrmMNr8Zxl1ViUh+8THMZM2h6ae35JtbhtLSyMNHUTyzRi7nNYwsB6a3Uxn7csso9JWRTS0hky0sURbcOMpuB6k7fJeLqS1s9nOz9G3OinqZ8VqrRT1zXRjXIXCzfkNbra4h4WraKioK18QdzwMwuBa4032W8u0w0xqJlVTyR1bGkODmuaC5uXQ31BX0pwngOBVXD8GMto2F00IcXPiF2kt1tbp6rgLcLMUHnawODTeOMAm3Qkrt3B+LNw7wpbW1JAEMBaHHoelvX1Pr6LWPSVxARGk4sjFOC29W0sB/p5lh/8Aa+2sKpWPgjGoOW9wdQvlHwwwWfiTjiOpcw8imcJXXHwtv5Qb9TuvrbAvNTMPcWCknS8ffZ1Qx8ABfK55uANgN+q0qYgAXJJ97LGx9rmSwOuQOY2/1WxTnUI66WxY/wAhP/sU2qa1tM/PCXtt8Nzqp49Be10+0svlJys6gdUHkYoOfN5LxOle1wk5YHnG4udR0HrcK7TQuilLzM573XuQQSG21A0120VrGcNa274WDIQNibtN9SFQnpZGOyyyytcfKxzxbyd/deDLeGV3NvXNZTqpHHDmRSRgPfNawDmAgk7a/wCFt4YGUmFmZ0Mz3tubRO8wAWLhlO2omLYYfh8r3nYkdV62hZHBEGNaNrO9V04p7X2c+S6nq8/JXzCfmtpXtYepsC73A0V2DFqOSzXtLX+pWrNTQvblLRZZdThNPI46L0etnxXLcW2zwEXtI0d8twqQ1xVzr3DmG35JjMMgheMrn+wKkqG8qspjsDdv5Kzf7S6/Sy8fhu9lmYjE6WAPj/iRnMw+q1nNuw+yzpS6J2myvyRC197ZuqCLFJI4ONw2xUjbOapWojsq9ZHnjv1arJ0TXC4ust/pjOTSVPWR8uS42OoVZxWo5WFujMmXSXREuZLnKhui6gnJTHFISmOKLojyoJHp0r1SmeSQ0buNkVYpxmzS+hstGIcunY3s0BV6aMBrWW0Vp3wlbjLxnilxJQ8PcMSVNYx0jnu5cLW/EXbix6dNV878UeI3F+Ih0VU6WGA+UMMZyn3u2110v7SsdRLhNHLGXNFPMX6dyLXXEIMNnxEc51dGJGuuWOc4Ov8A+x1XDPPtMpfhcp6ZlZhxnxmTKw3LC1uQ69dBqvLVZjilLqOV2VpIu7/hex4nkmpMAgpuW5xA88haHH5HoF4QSOc/QHfS24K6bn6cdavb0nAGF1WM8UYfQgNMU1Q0OcWZhYeY6C3Zdm8cKanwXhil+8iCbNUNaxkbHRONtfiJOnyXN/CfiOi4bxY1UuGvqqwsywODsrWuO5dpv009U/j7Hsf404ghp54nSuddtNDDESG3I0aNydNzr7Lf66J0rYLUvxrGIaGjpQHTODBGLm9z19F7LxFqs1RS8JYa4vpqPIyoMd7vftlAH6dyApcOwgeHuBcuzJeMMTbbRwP3CMjb/eRqT0+i914N+HDoJIcdxcOfL8cTH73O7zfYnp+50s+O2tb6bnhHwYeHeF3S1UQbXVfnl1uQSLW9mjT3Lu66Lg/kiazoApJYmtiyjsAPQJtC0sdqjpj+M1D8fhMuHue0XLPMrmHhzoGTFjznALQGk6KbltmhdG7ZwsocPq56DLQVXwDSKQbOHb3Wa18tCNs7togwd3n/AApnwzFg/wDILb/0tAUkVnNzE6Kwxt3eb6dk0jPjh5c0bMzjfzuLjcnspcRoqerg5c7GvbfYhAdzax7xtew9grMg/BPsVPWWaqy6ZuGtYA90bbBzj+y0W7LLwVx/EiO7Xk/IrVCSQTXvHdVJH5bqw0+Rw+aouBfIe11pCwgudmKhxdv4UbxvG7N9FbYLCyZKwSl7DsGWRSwkEBVa2LykgbJcNlz0zDfVt2n3BsrD7Em40KgxrIa7KnzMySub2KjIUaiS4cLhNKjDiCpAbhZsaivVRcyMt67hZDxa4O63XC/uszEosruY3Y7+6Ss5RRJSEpHJpK1WD7pCU0FNc5RVhxUT3JzionlFQzP3Vem/EqSejdE+d1gSUuFC7A47nzH5qz5K1acdfkpxoLFRwjyD1U2XRaZeV4+4Wg4jweakeB5xZfOmN8M1/Ddb/p9dcWvypTEXB7elyP2K+rqnNlIGYH+1eJ4rwNmLx5K4P8vwStaM8Z7rnlxy9te11p83Y1gUlYIrDKbE3itlcslvC9V5blwe4BzRluHDuD0t2K6dxdguO0AFJh1XS10dybyMEcjR8jYrz1fiGPwBrKptPTsADACwW0HdSTSXVnwThjCaCjoDNisPNdTzMfM2F45jYbgOeOmnX0K6ziWN8McKw/cuCMNjqsXqhlFWG8wtv1zHUnsBp3XDaKlqamvaBIw827Dy36Au6ey+qPDzgjC8AoKeo5LZ690TS6d+pbcDRoPwhdcb056YPh54dubVOx/iu9TXzHO2GR1wzW93dz6Lq9NG1jRlaB6AIhiA6Kw0K7ak0hkZca7qBjbPuruW6iLPNeyirVPsFYmgjqYDFK27T17eqrQaBXadplPL2B1cewQLhcEsMZfJO+Vt/wAMOA09VaqJeXTudfU6BK4i9gLAaBU65+Z7YwdtSgdRtsArrx+HY9dCq9K3QKaR2hPc2CDHiPJxlw2Ejf0Ws03Nll1zL19O9p1zhacXxlRUrd/dV3DK8j1Vq1iCopm2kuqhg2TID+I8nq4qQ6BV4zZ493X+qDMweS0tXDf4Zi4ex/5C02uvosGV/wBzx4E6Mn8h9zqPz/VbAdrdZi1DiDfxA4dQqTitKps6O6z3jVVYYDdOGijOiUOsosp5KiqGCSNzTsfyUl+yQrNaeflaWPLToQbKFxWpi0NrStG+hWW5WOdmqS6aSglMJQWXFRSFK52ihldYKVqK1YTy/wDcbBXMOYRGPZR08cdayMh+V8ZLSOhWnT0j2AeW47hbxjNqdgtbsFM1Na0p7Qqhr2dQs3FKdssLiDlcBcEbrYt0UNRGGtLyL6Xsg5HxDw9W4i+Wqpa6Vs7rsaCPIRfa3/C8vWcP8cU7DHRYVTVgdYO5kbXNPsLiy7vQ0TIwDlHt2WlFEANApo24z4Z+FdbDjEGOY/DS0xifzGUkDdC697u6fJduijsNk6KOymDVVx1vskbbjRSWI3CQDVOA0U7dLcNdQWRYXSoVcytsBc7BaVI3lQXd8b9T6eip0sfMmF/hb5j/AIVqR9zoiHueBdUmXknL+5T532jt3S0TDdBeiGVmm+wTJTr6DRSnyj2F1WmdZhQVP4uJM7MBK0YfjKoYey8j5Cr0O5UFh2yjqNwpHbJk+rW+yohJVRxtO4drn6qyVSlf/wCXJ6NCDH4lYXwc1nxNNwfXotChqBU0kU7dntBUOIM5sMjPos/hqctE1E86xuzM/wBp/wCf1Uvy1+m8HeUtKpztsSFO43CieeYy/XqiRWcm3SuGqaTqinApb3TE4HRSrEc7BJE5h6hYErS1xB3BXon6hY2Jsyy5wNHD81lcpuKDlG4p791E5VlI56rzv0Q56p1Eu6lWJ8Ckz1NbGN2uDh+S9dSXyheU4fgIbLMd3Nvdeow+ZuRok09VvGajOV3Wg1jXDzNBT/uzHfDdpSNcLgM19VZiHdVFGSFzD5hp3Cq1odaNg2c7X2A/+ltvAy6rJq6ctqxI2+Qt76XuiWo4WeitxNUMQsrLNkWHgJ4TAU4FA4JyaClugWyLaIUlO3PKAdhqUFiIcmDX4nalNuUSOzO9E29teyBsnmcfTT91co2WbdU2C+UHfc/PVaDPw4i7sECvNx6E6ewVWo1FlZcLADsFXkF3IHUzcsanhCjAswBTRoHlEn8NqQoefwwgruWSZL1c/oQPyWsd1hynLX1A/uH6IHz7X7rBq3GixGOsaPKDZ/q07rckdeO11n10Inp3NOpspZuNS6rWa4FoIOhUGfI/06qjgFSX0xp5D+JB5T6joVdm+JJ2lmqJWj4m7KAlTROzAsPyUUlwSikunDZRpzT0QOOyz8SZmiJttqr/AKKCobdhCxY3HnZBqonKzUNySOaeirPRnSjLLuoWxTVLwyGN77mxsNlHJI0SNDyQCbL01HUUwia2IBrQNlZNpbpJhlE+KHI+zb+q0YoQ21hf3UMVSwdLhSNl1uLkFbYW4nFmxVuGobeztFl80qWMPcLnRF21XvBGhVech0J9Coo5HtGVrtPZS3ZK3K8W/JVNK8asN2UfLLLC4d6hOLg0aoRJdKCqwnHNEbtC7ZW4oi4XuopAU66ZI0st2KaHIbSg2VqE5Ke5+J+qog5i1vcq1M7zBvYImz8yR58h9dPqowUpOrB/df6aobTw+aY9rq5IbtYz+pwVKi6lWs152+lz+SKkkNySod3Jxdomt+K6CTqpm6BQsNypboFJQ4/hD3TSdEj3fhD3QQuKwq85cSl9bfotpzlgY4clcD/Uy4+R/wCUDy7RNG6jjkDmgp4KDOqGmixGOqb8Djlk9j+y13nMbeihmhbUQuicNHBV6GR/L5Uuksfkdfrbqp8Vr5iwbh1wpTaRmYb9VG7UIieWuVqQwix1ShSTt1uNlDdRTymSbJQdEjtlKu2LirMrw/5FZ7jdbWJx54nAbrBLtVhp/9k=";

const COMMITTEES = [
  { name: "Registration", lead: "Julice Holder / Lucinda Parsons" },
  { name: "Sponsorships", lead: "Josie Hernandez / Jasmine Lawrence" },
  { name: "Vendors", lead: "Alisa Arthur / Michelle Evans" },
  { name: "Run of Show", lead: "Lasean Hardy / Bosede Bruce" },
  { name: "High Tea with MRD", lead: "Lisa Mitchell-Harris / Clarine Simpson" },
  { name: "Breakfast with Basilei", lead: "Lisa Mitchell-Harris / Clarine Simpson" },
  { name: "Service Project", lead: "Cherrisse Amaro" },
  { name: "Welcome Reception", lead: "Tekea Saunders / Cathy Duffy" },
  { name: "Rise and Radiate Yoga", lead: "Charlane Brown-Wyands" },
  { name: "Plenaries", lead: "Susan Edwards / Lasean Hardy / Nikoji Smith" },
  { name: "Flag Ceremony", lead: "Terri Barnett Coleman" },
  { name: "Workshops", lead: "Alisa Arthur / Michelle Evans" },
  { name: "Jewels Luncheon", lead: "Rashema Ingraham / Misti-Dawn Curry" },
  { name: "Global Spotlight", lead: "Iyandra Altun / Alicia Barnes" },
  { name: "Leadership Awards Luncheon", lead: "Saderia Nicole Hooks / Tanisha Tynes-Cambridge" },
  { name: "Legacy Parade", lead: "Anise Hodge" },
  { name: "Closing Gala", lead: "Melissa Hanna / Ramona Wells" },
  { name: "Sisterly Relations Glow and Flow", lead: "Deyzha Todman / Michelle Sizemore" },
  { name: "After Glow", lead: "Chioma Ladeninde / Shelly Williams" },
  { name: "Emergency Management", lead: "Keiva Bland / Cindy Dorsett" },
  { name: "Career Connections", lead: "Janine Clarke" },
  { name: "History Book", lead: "Phyllis E. Robinson" },
  { name: "Protocol & VSG", lead: "Melissa Hanna / LaToya Brooks" },
  { name: "Philacters", lead: "Alana Major" },
  { name: "Signage", lead: "Aramide Boatswain" },
  { name: "Decor & Branding", lead: "Team Elevation" },
  { name: "Communications", lead: "Lisa Smith" },
  { name: "Finance", lead: "Terri Barnett Coleman" },
  { name: "Shipping", lead: "Team Elevation" },
];

const TABS = ["Dashboard", "Committee Members", "Budget & Procurement", "Signage", "DJ & Music", "Logistics", "Event Timeline", "Shipping & Procurement", "Risk Log", "Travel", "📋 Executive Summary", "✨ AI Assistant"];

const STATUS_OPTIONS = ["Not Started", "In Progress", "At Risk", "Completed"];
const PAYMENT_OPTIONS = ["Unpaid", "Pending", "Paid"];

const STATUS_COLORS = {
  "Not Started": { bg: "#fce4f0", text: "#E91E8C", dot: "#E91E8C" },
  "In Progress": { bg: "#fff3e0", text: "#b45309", dot: "#b45309" },
  "At Risk": { bg: "#ffeaea", text: "#ad1457", dot: "#ad1457" },
  "Completed": { bg: "#dcfce7", text: "#15803d", dot: "#15803d" },
};

const emptySignageRow = () => ({ item: "", qty: "", location: "", dimensions: "", quoted: false, approved: false, ordered: false, shipped: false, delivered: false, installed: false });
const emptyMember = () => ({ name: "", chapter: "" });
const emptyDeliverable = () => ({ deliverable: "", dueDate: "", owner: "", approved: false, ordered: false, arrived: false, notes: "" });
const emptyRisk = () => ({ date: "", decision: "", decisionMade: "", approvedBy: "", notes: "" });
const emptyTraveler = () => ({ name: "", committee: "", arrival: "", departure: "", hotel: "", support: "", notes: "" });
const emptyTimelineEntry = () => ({ date: "", event: "", activityType: "Event", startTime: "", endTime: "", location: "", owner: "", notes: "" });

const ACTIVITY_TYPES = ["Setup", "Registration", "Meeting", "Event", "Rehearsal", "Plenary Session", "Tear Down"];
const ACTIVITY_COLORS = {
  "Setup": { bg: "#f3f4f6", text: "#4b5563" },
  "Registration": { bg: "#e0f2fe", text: "#0369a1" },
  "Meeting": { bg: "#fef3c7", text: "#92400e" },
  "Event": { bg: "#fce4f0", text: "#C2185B" },
  "Rehearsal": { bg: "#ede9fe", text: "#5b21b6" },
  "Plenary Session": { bg: "#dcfce7", text: "#15803d" },
  "Tear Down": { bg: "#fee2e2", text: "#b91c1c" },
};

const TIMELINE_SEED = [
  { day: "Tuesday, 7/14/26", entries: [
    { date: "7/14/2026", event: "Conference Bag Stuffing", activityType: "Setup", startTime: "9:00 AM", endTime: "9:00 PM", location: "", owner: "All Attendees", notes: "Invitation to all arriving in time to assist" },
  ]},
  { day: "Wednesday, 7/15/26", entries: [
    { date: "7/15/2026", event: "Emergency Medical Team", activityType: "Event", startTime: "", endTime: "", location: "", owner: "Keiva Bland", notes: "Will they have a station?" },
    { date: "7/15/2026", event: "Registration Setup", activityType: "Registration", startTime: "9:00 AM", endTime: "12:00 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/15/2026", event: "Team Elevation Boardroom Setup", activityType: "Setup", startTime: "9:00 AM", endTime: "9:00 PM", location: "", owner: "Lasean Hardy", notes: "LH" },
    { date: "7/15/2026", event: "Headshot Event", activityType: "Event", startTime: "", endTime: "", location: "", owner: "", notes: "" },
    { date: "7/15/2026", event: "Undergraduate Tea with MRD", activityType: "Event", startTime: "9:30 AM", endTime: "10:30 PM", location: "MRD's Suite", owner: "Lisa Mitchell-Harris / Clarine Simpson", notes: "" },
    { date: "7/15/2026", event: "Conference Registration Check-In", activityType: "Registration", startTime: "9:30 AM", endTime: "6:00 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/15/2026", event: "Soror Services", activityType: "Registration", startTime: "9:30 AM", endTime: "6:00 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/15/2026", event: "Service Project - Illuminating Sisters: Serving Those Who Serve", activityType: "Event", startTime: "10:00 AM", endTime: "5:00 PM", location: "", owner: "Cherrisse Amaro", notes: "Onsite: Liaison with Airforce Base to create care packages for Deployed Women." },
    { date: "7/15/2026", event: "Coffee and Conversation with Chapter Presidents", activityType: "Event", startTime: "11:00 AM", endTime: "12:00 PM", location: "MRD's Suite", owner: "Lisa Mitchell-Harris and Clarine Simpson", notes: "" },
    { date: "7/15/2026", event: "Career Connections", activityType: "Event", startTime: "", endTime: "", location: "", owner: "janinerclarke@gmail.com", notes: "" },
    { date: "7/15/2026", event: "Vendor Walk through and OPEN", activityType: "Setup", startTime: "4:00 PM", endTime: "5:00 PM", location: "", owner: "Alisa Arthur / Michelle Evans", notes: "Confirm Time" },
    { date: "7/15/2026", event: "Flag Ceremony Practice", activityType: "Rehearsal", startTime: "4:00 PM", endTime: "5:30 PM", location: "", owner: "Terri Barnett Coleman", notes: "Need Ghana and PR Flags & Confirm Time with Terri" },
    { date: "7/15/2026", event: "General Members Meeting (Election of Delegates)", activityType: "Meeting", startTime: "5:00 PM", endTime: "6:00 PM", location: "", owner: "", notes: "" },
    { date: "7/15/2026", event: "Conference Registration Check-In OPEN", activityType: "Registration", startTime: "5:00 PM", endTime: "7:00 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/15/2026", event: "35th IRC Steering Committee Meeting", activityType: "Meeting", startTime: "6:30 PM", endTime: "7:30 PM", location: "", owner: "Lasean Hardy", notes: "" },
    { date: "7/15/2026", event: "Welcome Reception", activityType: "Event", startTime: "6:30 PM", endTime: "9:30 PM", location: "", owner: "Tekea Saunders / Catherine Duffy", notes: "Many Cultures. One Sisterhood. One Light. Cultural Attire (Lighting of Unity candles and a representative presentation from each country), auction, showgirls, and magician" },
  ]},
  { day: "Thursday, 7/16/26", entries: [
    { date: "7/16/2026", event: "Exercise or Mental Health Sessions", activityType: "Event", startTime: "6:00 AM", endTime: "7:00 AM", location: "", owner: "", notes: "" },
    { date: "7/16/2026", event: "Conference Registration Check-In & Soror Services", activityType: "Registration", startTime: "7:00 AM", endTime: "8:00 AM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/16/2026", event: "Delegate & Alternate Registration Check-in & Certification", activityType: "Registration", startTime: "7:00 AM", endTime: "8:00 AM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/16/2026", event: "Prepare Standard Evaluation Room", activityType: "Setup", startTime: "8:00 AM", endTime: "12:00 PM", location: "", owner: "Lasean Hardy", notes: "Confirm Date and Time" },
    { date: "7/16/2026", event: "Plenary 1", activityType: "Plenary Session", startTime: "8:30 AM", endTime: "11:30 AM", location: "", owner: "Lasean Hardy", notes: "" },
    { date: "7/16/2026", event: "Delegate & Alternate Registration Check-in & Certification", activityType: "Registration", startTime: "10:00 AM", endTime: "5:00 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/16/2026", event: "Soror Services OPEN", activityType: "Registration", startTime: "10:00 AM", endTime: "5:00 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/16/2026", event: "Protocol VSG Basket Construction", activityType: "Setup", startTime: "10:00 AM", endTime: "12:00 PM", location: "", owner: "", notes: "LH" },
    { date: "7/16/2026", event: "Conference Registration Check-In & Soror Services", activityType: "Registration", startTime: "11:30 AM", endTime: "1:30 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/16/2026", event: "Leadership Awards Luncheon", activityType: "Event", startTime: "12:00 PM", endTime: "1:30 PM", location: "", owner: "Saderia Hooks / Tanisha Tynes-Cambridge", notes: "" },
    { date: "7/16/2026", event: "Vendor Marketplace", activityType: "Event", startTime: "1:30 PM", endTime: "7:00 PM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "Possibly 1-230 and 530-7 (Open between lunch and plenary 2, then again after plenary 2" },
    { date: "7/16/2026", event: "Chapter Evaluation Drop off", activityType: "Meeting", startTime: "2:00 PM", endTime: "3:00 PM", location: "", owner: "Lasean Hardy", notes: "Soror Phyllis Haynes, Lead Evaluator (No edits to this line)" },
    { date: "7/16/2026", event: "Rituals Rehearsal Meeting", activityType: "Rehearsal", startTime: "2:00 PM", endTime: "3:00 PM", location: "", owner: "Shanda Simmons", notes: "" },
    { date: "7/16/2026", event: "Plenary 2", activityType: "Plenary Session", startTime: "2:00 PM", endTime: "5:00 PM", location: "", owner: "Lasean Hardy", notes: "" },
    { date: "7/16/2026", event: "Regional Director's Meeting with Conference Committee Chairmen", activityType: "Meeting", startTime: "3:00 PM", endTime: "4:00 PM", location: "", owner: "", notes: "" },
    { date: "7/16/2026", event: "Regional Protocol Committee Meeting", activityType: "Meeting", startTime: "3:00 PM", endTime: "4:00 PM", location: "", owner: "Melissa Hanna and LaToya Brooks", notes: "" },
    { date: "7/16/2026", event: "Regional Philacter's Committee Meeting", activityType: "Meeting", startTime: "4:00 PM", endTime: "5:00 PM", location: "", owner: "Kim Treadway", notes: "" },
    { date: "7/16/2026", event: "Global Spotlight", activityType: "Event", startTime: "6:00 PM", endTime: "7:30 PM", location: "", owner: "", notes: "" },
    { date: "7/16/2026", event: "Sisterly Relations Event", activityType: "Event", startTime: "8:00 PM", endTime: "10:00 PM", location: "", owner: "Deyzha Todman", notes: "" },
    { date: "7/16/2026", event: "Afterglow Suite Connections", activityType: "Event", startTime: "10:30 PM", endTime: "11:30 PM", location: "MRD's Suite", owner: "Chi Ladeinde / Shelly Williams", notes: "" },
  ]},
  { day: "Friday, 7/17/26", entries: [
    { date: "7/17/2026", event: "Exercise or Mental Health Sessions", activityType: "Event", startTime: "6:00 AM", endTime: "7:00 AM", location: "", owner: "", notes: "" },
    { date: "7/17/2026", event: "Conference Registration Check-In & Soror Services Open", activityType: "Registration", startTime: "8:00 AM", endTime: "12:00 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/17/2026", event: "Conference Workshops - Series A", activityType: "Meeting", startTime: "8:00 AM", endTime: "9:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Standing on Business: The Chapter Agenda", activityType: "Meeting", startTime: "8:00 AM", endTime: "9:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Greek Shenanigans 5: If It Ain't One Thing, It's Another", activityType: "Meeting", startTime: "8:00 AM", endTime: "9:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Still We Soar! Encore: Chapter Operations That Help Us SOAR!", activityType: "Meeting", startTime: "8:00 AM", endTime: "9:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Sip, Serve & Soar: The Playbook on How to Spill the Tea on Your Chapter's Program Impact", activityType: "Meeting", startTime: "8:00 AM", endTime: "9:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Conference Workshops - Series B", activityType: "Meeting", startTime: "10:00 AM", endTime: "11:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Soaring in AKA Protocol: Strengthening our Knowledge and Understanding of Protocol the AKA Way!", activityType: "Meeting", startTime: "10:00 AM", endTime: "11:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Sisterhood Unlocked", activityType: "Meeting", startTime: "10:00 AM", endTime: "11:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "The Power Shift: Turning Visibility Into Influence: An AKA Branding and Communications Masterclass", activityType: "Meeting", startTime: "10:00 AM", endTime: "11:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Financial Essentials", activityType: "Meeting", startTime: "10:00 AM", endTime: "11:30 AM", location: "", owner: "Alisa Arthur / Michelle Flagg-Evans", notes: "" },
    { date: "7/17/2026", event: "Jewels Luncheon", activityType: "Event", startTime: "12:00 PM", endTime: "1:30 PM", location: "", owner: "Rashema Ingraham / Misti Dawn Curry", notes: 'Committee voting on theme from 3 options (Vision: Soft & Feminine, Gold/silver accents, Centerpieces: Crown and lanterns with native translations for "light"' },
    { date: "7/17/2026", event: "Legacy Parade", activityType: "Meeting", startTime: "1:45 PM", endTime: "2:00 PM", location: "", owner: "Anise Hodge", notes: "Concept: Night Parade with glow items" },
    { date: "7/17/2026", event: "Legacy Parade - Global Illumination of Purpose & Legacy", activityType: "Event", startTime: "2:00 PM", endTime: "2:30 PM", location: "", owner: "Anise Hodge", notes: "" },
    { date: "7/17/2026", event: "Plenary 3", activityType: "Plenary Session", startTime: "2:30 PM", endTime: "5:30 PM", location: "", owner: "Lasean Hardy", notes: "" },
    { date: "7/17/2026", event: "Soror Services Open", activityType: "Registration", startTime: "5:30 PM", endTime: "6:30 PM", location: "Registration Area", owner: "Julice Holder/Lucinda Parsons", notes: "" },
    { date: "7/17/2026", event: "Closing Gala -- Illumination", activityType: "Setup", startTime: "7:00 PM", endTime: "12:00 AM", location: "", owner: "Ramona Wells / Melissa Hanna", notes: "" },
    { date: "7/17/2026", event: "Closing Gala -- Illumination", activityType: "Event", startTime: "7:30 PM", endTime: "10:30 PM", location: "", owner: "Ramona Wells / Melissa Hanna", notes: "" },
    { date: "7/17/2026", event: "Closing Gala -- Illumination", activityType: "Tear Down", startTime: "10:30 PM", endTime: "12:00 AM", location: "", owner: "Ramona Wells / Melissa Hanna", notes: "" },
  ]},
];
const emptyDjEvent = (c) => ({
  event: c.name, lead: c.lead,
  musicNeeded: null, // null | "dj" | "playlist" | "none"
  setTime: "", setDuration: "",
  playlistOwner: "", playlistPlatform: "", playlistLink: "",
  notes: "",
});

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS["Not Started"];
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <span
      onClick={() => onChange(!checked)}
      className="toggle-tap-area"
      style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", flexShrink: 0 }}
    >
      <span style={{ width: 40, height: 22, borderRadius: 11, background: checked ? "#E91E8C" : "#d1d5db", position: "relative", transition: "background 0.2s", display: "inline-block", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 3, left: checked ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", display: "block" }} />
      </span>
    </span>
  );
}

export default function App() {
  const pink = "#E91E8C";
  const lightPink = "#fff0f8";
  const green = "#004B23";

  const [tab, setTab] = useState("Dashboard");
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  const [data, setData] = useState(() =>
    Object.fromEntries(COMMITTEES.map(c => [c.name, {
      status: "Not Started", budgetSubmitted: false, quotesSubmitted: false, onTrack: false,
      risks: "", lastUpdated: "", runOfShowComplete: false, rehearsalNeeded: c.name === "Legacy Parade",
      avNeeds: "", roomSetupFinalized: false, lead: c.lead,
    }]))
  );

  const updateCommittee = (name, field, value) =>
    setData(prev => ({ ...prev, [name]: { ...prev[name], [field]: value, lastUpdated: new Date().toLocaleDateString() } }));

  // Committee Members
  const [members, setMembers] = useState(() =>
    Object.fromEntries(COMMITTEES.map(c => [c.name, [emptyMember()]]))
  );
  const addMember = (name) => setMembers(prev => ({ ...prev, [name]: [...prev[name], emptyMember()] }));
  const removeMember = (name, i) => setMembers(prev => ({ ...prev, [name]: prev[name].filter((_, j) => j !== i).length ? prev[name].filter((_, j) => j !== i) : [emptyMember()] }));
  const updateMember = (name, i, field, value) => setMembers(prev => ({ ...prev, [name]: prev[name].map((r, j) => j === i ? { ...r, [field]: value } : r) }));

  // Signage
  const [signageRows, setSignageRows] = useState(() =>
    Object.fromEntries(COMMITTEES.map(c => [c.name, [emptySignageRow()]]))
  );
  const addSignageRow = (name) => setSignageRows(prev => ({ ...prev, [name]: [...prev[name], emptySignageRow()] }));
  const removeSignageRow = (name, i) => setSignageRows(prev => ({ ...prev, [name]: prev[name].filter((_, j) => j !== i).length ? prev[name].filter((_, j) => j !== i) : [emptySignageRow()] }));
  const updateSignageRow = (name, i, field, value) => setSignageRows(prev => ({ ...prev, [name]: prev[name].map((r, j) => j === i ? { ...r, [field]: value } : r) }));

  // Deliverables
  const [deliverables, setDeliverables] = useState(() =>
    Object.fromEntries(COMMITTEES.map(c => [c.name, [emptyDeliverable()]]))
  );
  const addDeliverable = (name) => setDeliverables(prev => ({ ...prev, [name]: [...prev[name], emptyDeliverable()] }));
  const removeDeliverable = (name, i) => setDeliverables(prev => ({ ...prev, [name]: prev[name].filter((_, j) => j !== i).length ? prev[name].filter((_, j) => j !== i) : [emptyDeliverable()] }));
  const updateDeliverable = (name, i, field, value) => setDeliverables(prev => ({ ...prev, [name]: prev[name].map((r, j) => j === i ? { ...r, [field]: value } : r) }));

  // Risk Log
  const [risks, setRisks] = useState(() =>
    Object.fromEntries(COMMITTEES.map(c => [c.name, [emptyRisk()]]))
  );
  const addRisk = (name) => setRisks(prev => ({ ...prev, [name]: [...prev[name], emptyRisk()] }));
  const removeRisk = (name, i) => setRisks(prev => ({ ...prev, [name]: prev[name].filter((_, j) => j !== i).length ? prev[name].filter((_, j) => j !== i) : [emptyRisk()] }));
  const updateRisk = (name, i, field, value) => setRisks(prev => ({ ...prev, [name]: prev[name].map((r, j) => j === i ? { ...r, [field]: value } : r) }));

  // Travel
  const [travelers, setTravelers] = useState([
    { name: "Carrie J. Clark", committee: "MRD", arrival: "2026-07-17", departure: "2026-07-31", hotel: "Mandalay Bay", support: "", notes: "" },
    { name: "Lasean Hardy", committee: "Chairman", arrival: "2026-07-17", departure: "2026-07-30", hotel: "Mandalay Bay", support: "", notes: "" },
    { name: "Bosede Bruce", committee: "Logistics", arrival: "2026-07-18", departure: "2026-07-24", hotel: "Mandalay Bay", support: "", notes: "" },
    { name: "Aramide Boatswain", committee: "Technology", arrival: "2026-07-19", departure: "2026-07-30", hotel: "", support: "", notes: "" },
    { name: "Terri Barnett Coleman", committee: "Tamiouchos", arrival: "2026-07-18", departure: "2026-07-29", hotel: "", support: "", notes: "" },
  ]);
  const addTraveler = () => setTravelers(prev => [...prev, emptyTraveler()]);
  const removeTraveler = (i) => setTravelers(prev => prev.filter((_, j) => j !== i));
  const updateTraveler = (i, field, value) => setTravelers(prev => prev.map((r, j) => j === i ? { ...r, [field]: value } : r));

  // DJ & Music — one shared DJ profile + per-event scheduling
  const [djProfile, setDjProfile] = useState({
    djName: "Pretty Tammi", company: "The DJ Events & Entertainment", contact: "", phone: "404-590-4561", email: "", genre: "", equipmentProvided: false, notes: "",
  });
  const updateDjProfile = (field, value) => setDjProfile(prev => ({ ...prev, [field]: value }));

  const [djEvents, setDjEvents] = useState(() => COMMITTEES.map(c => emptyDjEvent(c)));
  const updateDjEvent = (idx, field, value) => setDjEvents(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));

  // Event Timeline — grouped by day
  const [timeline, setTimeline] = useState(() =>
    TIMELINE_SEED.map(d => ({ day: d.day, entries: d.entries.map(e => ({ ...e })) }))
  );
  const addTimelineEntry = (dayIdx) => setTimeline(prev => prev.map((d, i) => i === dayIdx ? { ...d, entries: [...d.entries, emptyTimelineEntry()] } : d));
  const removeTimelineEntry = (dayIdx, entryIdx) => setTimeline(prev => prev.map((d, i) => i === dayIdx ? { ...d, entries: d.entries.filter((_, j) => j !== entryIdx) } : d));
  const updateTimelineEntry = (dayIdx, entryIdx, field, value) => setTimeline(prev => prev.map((d, i) => i === dayIdx ? { ...d, entries: d.entries.map((e, j) => j === entryIdx ? { ...e, [field]: value } : e) } : d));
  const addTimelineDay = () => setTimeline(prev => [...prev, { day: "New Day", entries: [emptyTimelineEntry()] }]);
  const updateTimelineDayName = (dayIdx, value) => setTimeline(prev => prev.map((d, i) => i === dayIdx ? { ...d, day: value } : d));

  // AI
  const [aiMessages, setAiMessages] = useState([{ role: "assistant", content: "Hello! I'm your 35th IRC Operations Assistant. Ask me anything about committee status, risks, next steps, or draft communications." }]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Executive Summary export state
  const [reportGeneratedAt, setReportGeneratedAt] = useState(null);
  const [copyConfirmation, setCopyConfirmation] = useState(false);

  // ── PERSISTENCE (Supabase) ───────────────────────────────────────────
  // All committee/event data is saved to a shared Supabase table so every
  // committee lead who opens this app — on any device, with or without a
  // Claude account — sees the same live, up-to-date information.
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | saving | saved | error
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const hasHydrated = useRef(false);
  const saveTimer = useRef(null);
  const isApplyingRemoteUpdate = useRef(false);

  const applySnapshot = (saved) => {
    isApplyingRemoteUpdate.current = true;
    if (saved.data) {
      // Snapshots saved before the "Chairman(s) / Lead" field existed won't have
      // a `lead` value for any committee. Rather than show those blank, fall back
      // to the original seeded name so nobody's chairman list appears to vanish.
      const backfilled = Object.fromEntries(
        COMMITTEES.map(c => {
          const savedEntry = saved.data[c.name] || {};
          const hasLead = typeof savedEntry.lead === "string" && savedEntry.lead.trim() !== "";
          return [c.name, { ...savedEntry, lead: hasLead ? savedEntry.lead : c.lead }];
        })
      );
      setData(backfilled);
    }
    if (saved.members) setMembers(saved.members);
    if (saved.signageRows) setSignageRows(saved.signageRows);
    if (saved.deliverables) setDeliverables(saved.deliverables);
    if (saved.risks) setRisks(saved.risks);
    if (saved.travelers) setTravelers(saved.travelers);
    if (saved.djProfile) setDjProfile(saved.djProfile);
    if (saved.djEvents) setDjEvents(saved.djEvents);
    if (saved.timeline) setTimeline(saved.timeline);
    if (saved.savedAt) setLastSyncedAt(new Date(saved.savedAt));
  };

  // Load saved data once when the app first opens.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await loadTrackerState();
        if (!cancelled && result && result.snapshot) {
          applySnapshot(result.snapshot);
        }
      } catch {
        // No saved data yet, or a connection issue — defaults stand.
        setSyncStatus("error");
      } finally {
        if (!cancelled) {
          hasHydrated.current = true;
          setIsLoaded(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Subscribe to live updates from other people editing the same tracker,
  // so changes made by one committee lead show up for everyone else.
  useEffect(() => {
    const channel = supabase
      .channel("irc_tracker_state_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "irc_tracker_state" },
        (payload) => {
          const incoming = payload.new && payload.new.snapshot;
          if (incoming) {
            isApplyingRemoteUpdate.current = true;
            applySnapshot(incoming);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Save to Supabase whenever any tracked data changes, debounced so rapid
  // typing doesn't fire a save on every keystroke.
  useEffect(() => {
    if (!hasHydrated.current) return; // don't save until the initial load finished
    if (isApplyingRemoteUpdate.current) {
      // This change came from another user via the realtime subscription —
      // it's already saved, so skip re-saving it right back.
      isApplyingRemoteUpdate.current = false;
      return;
    }
    setSyncStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const snapshot = {
        data, members, signageRows, deliverables, risks, travelers, djProfile, djEvents, timeline,
        savedAt: new Date().toISOString(),
      };
      try {
        await saveTrackerState(snapshot);
        setSyncStatus("saved");
        setLastSyncedAt(new Date());
      } catch {
        setSyncStatus("error");
      }
    }, 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, members, signageRows, deliverables, risks, travelers, djProfile, djEvents, timeline]);

  const completedCount = Object.values(data).filter(d => d.status === "Completed").length;
  const atRiskCount = Object.values(data).filter(d => d.status === "At Risk").length;
  const inProgressCount = Object.values(data).filter(d => d.status === "In Progress").length;
  const notStartedCount = Object.values(data).filter(d => d.status === "Not Started").length;
  const budgetCount = Object.values(data).filter(d => d.budgetSubmitted).length;
  const quotesCount = Object.values(data).filter(d => d.quotesSubmitted).length;
  const onTrackCount = Object.values(data).filter(d => d.onTrack).length;
  const totalCommittees = COMMITTEES.length;

  const totalMembers = Object.values(members).reduce((s, rows) => s + rows.filter(r => r.name.trim()).length, 0);
  const totalSignageItems = Object.values(signageRows).reduce((s, rows) => s + rows.filter(r => r.item.trim()).length, 0);
  const signageInstalled = Object.values(signageRows).reduce((s, rows) => s + rows.filter(r => r.item.trim() && r.installed).length, 0);
  const totalDeliverables = Object.values(deliverables).reduce((s, rows) => s + rows.filter(r => r.deliverable.trim()).length, 0);
  const deliverablesArrived = Object.values(deliverables).reduce((s, rows) => s + rows.filter(r => r.deliverable.trim() && r.arrived).length, 0);
  const totalRiskEntries = Object.values(risks).reduce((s, rows) => s + rows.filter(r => r.decision.trim()).length, 0);
  const totalTimelineEntries = timeline.reduce((s, d) => s + d.entries.filter(e => e.event.trim()).length, 0);
  const djAssignedCount = djEvents.filter(e => e.musicNeeded === "dj").length;
  const playlistAssignedCount = djEvents.filter(e => e.musicNeeded === "playlist").length;
  const noMusicCount = djEvents.filter(e => e.musicNeeded === "none").length;
  const musicUndecidedCount = djEvents.filter(e => e.musicNeeded === null).length;

  const committeesAtRisk = COMMITTEES.filter(c => data[c.name].status === "At Risk");
  const committeesWithNotedRisks = COMMITTEES.filter(c => data[c.name].risks && data[c.name].risks.trim());
  const committeesMissingBudget = COMMITTEES.filter(c => !data[c.name].budgetSubmitted);

  const buildReportSnapshot = () => ({
    generatedAt: new Date().toISOString(),
    conference: "35th IRC",
    committeeCount: totalCommittees,
    statusBreakdown: { completed: completedCount, inProgress: inProgressCount, atRisk: atRiskCount, notStarted: notStartedCount },
    budgets: { submitted: budgetCount, total: totalCommittees, quotesIn: quotesCount },
    onTrackCount,
    committees: COMMITTEES.map(c => ({
      name: c.name,
      lead: data[c.name].lead,
      status: data[c.name].status,
      budgetSubmitted: data[c.name].budgetSubmitted,
      quotesSubmitted: data[c.name].quotesSubmitted,
      onTrack: data[c.name].onTrack,
      risks: data[c.name].risks,
      lastUpdated: data[c.name].lastUpdated,
      memberCount: members[c.name].filter(m => m.name.trim()).length,
      signageItemCount: signageRows[c.name].filter(r => r.item.trim()).length,
      deliverableCount: deliverables[c.name].filter(r => r.deliverable.trim()).length,
      deliverablesArrived: deliverables[c.name].filter(r => r.deliverable.trim() && r.arrived).length,
      openRiskItems: risks[c.name].filter(r => r.decision.trim()).length,
    })),
    members: { totalLogged: totalMembers },
    signage: { totalItems: totalSignageItems, installed: signageInstalled },
    shipping: { totalDeliverables, arrived: deliverablesArrived },
    riskLog: { totalEntries: totalRiskEntries },
    timeline: { totalEntries: totalTimelineEntries, days: timeline.length },
    music: { liveDj: djAssignedCount, playlist: playlistAssignedCount, none: noMusicCount, undecided: musicUndecidedCount, djProfile },
    travelers: travelers.filter(t => t.name.trim()),
  });

  const downloadJsonExport = () => {
    const snapshot = buildReportSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `35th-IRC-status-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setReportGeneratedAt(new Date());
  };

  const copyJsonToClipboard = async () => {
    const snapshot = buildReportSnapshot();
    try {
      await navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
      setCopyConfirmation(true);
      setTimeout(() => setCopyConfirmation(false), 2200);
    } catch {
      setCopyConfirmation(false);
    }
  };

  const printSummary = () => {
    window.print();
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = { role: "user", content: aiInput };
    const msgs = [...aiMessages, userMsg];
    setAiMessages(msgs);
    setAiInput("");
    setAiLoading(true);
    // NOTE: In the standalone deployed version of this app, the AI Assistant
    // cannot call the Anthropic API directly from the browser — that only
    // worked inside the Claude artifact sandbox, which proxied the request.
    // A real deployment needs a small backend endpoint (e.g. a Vercel
    // serverless function) that holds the API key server-side and forwards
    // the request. Until that's added, this tells the user clearly instead
    // of silently failing or pretending to work.
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        role: "assistant",
        content: "The AI Assistant isn't connected in this deployed version yet — it needs a small backend function to securely call Claude's API (an API key can't live in the browser). Everything else in the app (status tracking, budgets, signage, the Executive Summary, etc.) is fully working and saving to the shared database. Ask your developer/Claude to add a serverless API route if you'd like this feature enabled.",
      }]);
      setAiLoading(false);
    }, 400);
  };

  const inputStyle = { padding: "5px 8px", borderRadius: 7, border: "1px solid #fce4f0", fontSize: 12, boxSizing: "border-box", color: "#003d1e", width: "100%" };
  const thStyle = { padding: "11px 13px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#004B23", letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #fce4f0", whiteSpace: "nowrap", background: lightPink };
  const tdStyle = (i) => ({ padding: "9px 13px", background: i % 2 === 0 ? "#fff" : "#fff8f9", borderBottom: "1px solid #fce4f0" });

  const sectionHeader = (title, subtitle) => (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{title}</h2>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>{subtitle}</p>}
    </div>
  );

  const addRowBtn = (onClick) => (
    <button onClick={onClick} style={{ fontSize: 12, padding: "3px 12px", borderRadius: 20, border: "1px solid #004B23", background: "#fff", color: "#004B23", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>+ Add Row</button>
  );

  const removeRowBtn = (onClick) => (
    <button onClick={onClick} style={{ background: "none", border: "none", color: "#f48cb8", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>×</button>
  );

  const djCountByType = (val) => djEvents.filter(e => e.musicNeeded === val).length;

  const summaryStatBox = (label, value, color, bg) => (
    <div style={{ background: bg || "#fff", border: "1px solid #fce4f0", borderRadius: 12, padding: "14px 16px", textAlign: "center", flex: 1, minWidth: 110 }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || "#003d1e" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{label}</div>
    </div>
  );

  if (!isLoaded) {
    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#fff5fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, margin: "0 auto 14px", border: "3px solid #fce4f0", borderTopColor: "#E91E8C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Loading 35th IRC Operations data…</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#fff5fb", color: "#003d1e" }}>

      {/* ── HEADER ── */}
      <div className="no-print app-header" style={{ background: "linear-gradient(135deg, #E91E8C 0%, #C2185B 55%, #004B23 100%)", padding: "28px 32px 0", color: "#fff" }}>
        <div className="header-top-row" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#f8a8d0", textTransform: "uppercase", marginBottom: 4 }}>35th IRC · Master Operations</div>
            <h1 className="header-title" style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>Operations Command Center</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{totalCommittees} Committees · Steering-Committee Tracker</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 10px" }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", display: "inline-block",
                background: syncStatus === "error" ? "#f87171" : syncStatus === "saving" ? "#fde68a" : "#86efac",
                animation: syncStatus === "saving" ? "pulse 1s ease-in-out infinite" : "none",
              }} />
              {syncStatus === "saving" && "Saving…"}
              {syncStatus === "saved" && `Saved${lastSyncedAt ? " · " + lastSyncedAt.toLocaleTimeString() : ""}`}
              {syncStatus === "error" && "Sync error — changes may not be saved"}
              {syncStatus === "idle" && (lastSyncedAt ? `Last synced ${lastSyncedAt.toLocaleString()}` : "Shared data — not yet saved")}
            </div>
          </div>
          <div className="header-right-col" style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
            <div className="director-card" style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 16px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <img src={MRD_PHOTO} alt="Carrie J. Clark" style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", objectFit: "cover", flexShrink: 0, display: "block" }} />
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>International Regional Director</div>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>Carrie J. Clark</div>
              </div>
            </div>
            <div className="stat-pill-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {[{ label: "Completed", val: completedCount, color: "#86efac" }, { label: "In Progress", val: inProgressCount, color: "#fde68a" }, { label: "At Risk", val: atRiskCount, color: "#f48cb8" }, { label: "On Track", val: onTrackCount, color: "#bbf7d0" }].map(s => (
                <div key={s.label} className="stat-pill" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(completedCount / totalCommittees) * 100}%`, background: `linear-gradient(90deg, #E91E8C, #F06292)`, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, marginBottom: 16 }}>{Math.round((completedCount / totalCommittees) * 100)}% of committees completed</div>
        </div>
        <div className="tab-row" style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="tab-button" style={{ background: tab === t ? "#fff" : "transparent", color: tab === t ? "#E91E8C" : "rgba(255,255,255,0.65)", border: "none", padding: "10px 15px", borderRadius: "8px 8px 0 0", cursor: "pointer", fontSize: 12, fontWeight: tab === t ? 700 : 500, whiteSpace: "nowrap" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={`main-content ${tab === "📋 Executive Summary" ? "print-area" : ""}`} style={{ padding: "24px 28px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ── DASHBOARD ── */}
        {tab === "Dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {COMMITTEES.map(c => {
              const d = data[c.name];
              return (
                <div key={c.name} onClick={() => setSelectedCommittee(selectedCommittee === c.name ? null : c.name)}
                  style={{ background: "#fff", borderRadius: 14, padding: "15px 17px", border: `1px solid ${d.status === "At Risk" ? "#fecaca" : "#fce4f0"}`, cursor: "pointer", boxShadow: "0 1px 4px rgba(200,16,46,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{data[c.name].lead}</div>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 11, flexWrap: "wrap" }}>
                    {[{ label: "Budget", val: d.budgetSubmitted }, { label: "Quotes", val: d.quotesSubmitted }, { label: "On Track", val: d.onTrack }].map(item => (
                      <span key={item.label} style={{ fontSize: 11, color: item.val ? "#27ae60" : "#9ca3af", background: item.val ? "#e8f8f0" : "#f3f4f6", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                        {item.val ? "✓" : "○"} {item.label}
                      </span>
                    ))}
                  </div>
                  {d.risks && <div style={{ marginTop: 8, fontSize: 11, color: "#c0392b", background: "#ffeaea", borderRadius: 6, padding: "4px 8px" }}>⚠ {d.risks}</div>}
                  {selectedCommittee === c.name && (
                    <div onClick={e => e.stopPropagation()} style={{ marginTop: 14, borderTop: "1px solid #fce4f0", paddingTop: 12 }}>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", display: "block", marginBottom: 3 }}>Chairman(s) / Lead</label>
                        <input value={d.lead} onChange={e => updateCommittee(c.name, "lead", e.target.value)} placeholder="Name(s), separated by / " style={inputStyle} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", display: "block", marginBottom: 3 }}>Status</label>
                          <select value={d.status} onChange={e => updateCommittee(c.name, "status", e.target.value)} style={{ ...inputStyle }}>
                            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", display: "block", marginBottom: 3 }}>Risks / Issues</label>
                          <input value={d.risks} onChange={e => updateCommittee(c.name, "risks", e.target.value)} placeholder="Note any risks..." style={inputStyle} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        {[{ label: "Budget Submitted", field: "budgetSubmitted" }, { label: "Quotes In", field: "quotesSubmitted" }, { label: "On Track", field: "onTrack" }].map(item => (
                          <div key={item.field} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <Toggle checked={d[item.field]} onChange={v => updateCommittee(c.name, item.field, v)} />
                            <span style={{ fontSize: 12, color: "#374151" }}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── COMMITTEE MEMBERS ── */}
        {tab === "Committee Members" && (
          <div>
            {sectionHeader("Committee Members", "List all members for each committee — include name and chapter affiliation.")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COMMITTEES.map((c, ci) => {
                const rows = members[c.name];
                return (
                  <div key={c.name} style={{ background: "#fff", borderRadius: 14, border: "1px solid #fce4f0", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", background: ci % 2 === 0 ? lightPink : "#f9fef9", borderBottom: "1px solid #fce4f0" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 10 }}>{data[c.name].lead}</span>
                        <span style={{ fontSize: 11, color: pink, marginLeft: 10, fontWeight: 600 }}>{rows.filter(r => r.name).length} member{rows.filter(r => r.name).length !== 1 ? "s" : ""}</span>
                      </div>
                      {addRowBtn(() => addMember(c.name))}
                    </div>
                    <div style={{ padding: "10px 15px", display: "flex", flexDirection: "column", gap: 6 }}>
                      {rows.map((row, ri) => (
                        <div key={ri} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, minWidth: 20, textAlign: "right" }}>{ri + 1}</span>
                          <div style={{ flex: 2 }}>
                            <input value={row.name} onChange={e => updateMember(c.name, ri, "name", e.target.value)} placeholder="Member name..." style={inputStyle} />
                          </div>
                          <div style={{ flex: 2 }}>
                            <input value={row.chapter} onChange={e => updateMember(c.name, ri, "chapter", e.target.value)} placeholder="Chapter affiliation..." style={inputStyle} />
                          </div>
                          {rows.length > 1 && removeRowBtn(() => removeMember(c.name, ri))}
                        </div>
                      ))}
                      {rows.length === 1 && !rows[0].name && (
                        <div style={{ textAlign: "center", padding: "6px 0", fontSize: 12, color: "#9ca3af" }}>Enter the first member above or click "+ Add Row"</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BUDGET & PROCUREMENT ── */}
        {tab === "Budget & Procurement" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Budget & Procurement</h2>
              <span style={{ fontSize: 12, color: "#6b7280", background: "#fff", padding: "5px 14px", borderRadius: 20, border: "1px solid #fce4f0" }}>{budgetCount} / {totalCommittees} budgets submitted</span>
            </div>
            <div className="scroll-wrap" style={{ background: "#fff", borderRadius: 14, border: "1px solid #fce4f0", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Committee", "Lead", "Budget Submitted", "Quotes In", "Approved by MRD", "Payment Status", "Notes"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {COMMITTEES.map((c, i) => {
                    const d = data[c.name];
                    return (
                      <tr key={c.name}>
                        <td style={{ ...tdStyle(i), fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                        <td style={{ ...tdStyle(i), fontSize: 11, color: "#6b7280" }}>{data[c.name].lead}</td>
                        <td style={tdStyle(i)}><Toggle checked={d.budgetSubmitted} onChange={v => updateCommittee(c.name, "budgetSubmitted", v)} /></td>
                        <td style={tdStyle(i)}><Toggle checked={d.quotesSubmitted} onChange={v => updateCommittee(c.name, "quotesSubmitted", v)} /></td>
                        <td style={tdStyle(i)}><Toggle checked={d.onTrack} onChange={v => updateCommittee(c.name, "onTrack", v)} /></td>
                        <td style={tdStyle(i)}><select style={{ ...inputStyle, width: 100 }}>{PAYMENT_OPTIONS.map(p => <option key={p}>{p}</option>)}</select></td>
                        <td style={tdStyle(i)}><input placeholder="Notes..." style={{ ...inputStyle, width: 150 }} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SIGNAGE ── */}
        {tab === "Signage" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Signage Tracker</h2>
              <span style={{ fontSize: 12, color: "#6b7280", background: "#fff", padding: "5px 14px", borderRadius: 20, border: "1px solid #fce4f0" }}>
                {Object.values(signageRows).reduce((s, r) => s + r.length, 0)} total items
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COMMITTEES.map((c, ci) => {
                const rows = signageRows[c.name];
                return (
                  <div key={c.name} style={{ background: "#fff", borderRadius: 14, border: "1px solid #fce4f0", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", background: ci % 2 === 0 ? lightPink : "#f9fef9", borderBottom: "1px solid #fce4f0" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 10 }}>{data[c.name].lead}</span>
                      </div>
                      {addRowBtn(() => addSignageRow(c.name))}
                    </div>
                    <div className="scroll-wrap" style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
                        <thead>
                          <tr>{["#", "Signage Item", "Qty", "Venue Location", "Sign Dimensions", "Quoted", "Approved", "Ordered", "Shipped", "Delivered", "Installed", ""].map(h => (
                            <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", borderBottom: "1px solid #fce4f0" }}>{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {rows.map((row, ri) => (
                            <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#fff8f9", borderBottom: ri < rows.length - 1 ? "1px solid #f0faf2" : "none" }}>
                              <td style={{ padding: "7px 10px", fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{ri + 1}</td>
                              <td style={{ padding: "7px 10px" }}><input value={row.item} onChange={e => updateSignageRow(c.name, ri, "item", e.target.value)} placeholder="Signage item..." style={{ ...inputStyle, width: 150 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input type="number" value={row.qty} onChange={e => updateSignageRow(c.name, ri, "qty", e.target.value)} placeholder="0" style={{ ...inputStyle, width: 46 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input value={row.location} onChange={e => updateSignageRow(c.name, ri, "location", e.target.value)} placeholder="Location..." style={{ ...inputStyle, width: 120 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input value={row.dimensions} onChange={e => updateSignageRow(c.name, ri, "dimensions", e.target.value)} placeholder='e.g. 24" x 36"' style={{ ...inputStyle, width: 100 }} /></td>
                              {["quoted", "approved", "ordered", "shipped", "delivered", "installed"].map(f => (
                                <td key={f} style={{ padding: "7px 10px", textAlign: "center" }}>
                                  <input type="checkbox" checked={row[f]} onChange={e => updateSignageRow(c.name, ri, f, e.target.checked)} style={{ accentColor: "#E91E8C", width: 15, height: 15, cursor: "pointer" }} />
                                </td>
                              ))}
                              <td style={{ padding: "7px 10px" }}>
                                {rows.length > 1 && removeRowBtn(() => removeSignageRow(c.name, ri))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DJ & MUSIC ── */}
        {tab === "DJ & Music" && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>🎧 DJ & Music Tracker</h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>One DJ covers all events — set their info once below, then schedule set times per event.</p>
            </div>

            {/* Shared DJ profile card */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f48cb8", padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: pink }}>🎧 Our DJ — Shared Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 9 }}>
                {[
                  { label: "DJ Name", field: "djName", ph: "Full name" },
                  { label: "Company / Agency", field: "company", ph: "Company name" },
                  { label: "Contact Person", field: "contact", ph: "Contact name" },
                  { label: "Phone", field: "phone", ph: "Phone number" },
                  { label: "Email", field: "email", ph: "Email address" },
                  { label: "Genre / Style", field: "genre", ph: "e.g. R&B, Top 40" },
                ].map(f => (
                  <div key={f.field}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", display: "block", marginBottom: 3 }}>{f.label}</label>
                    <input value={djProfile[f.field]} onChange={e => updateDjProfile(f.field, e.target.value)} placeholder={f.ph} style={inputStyle} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Toggle checked={djProfile.equipmentProvided} onChange={v => updateDjProfile("equipmentProvided", v)} />
                  <span style={{ fontSize: 12, color: "#374151" }}>DJ Provides Equipment</span>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", display: "block", marginBottom: 3 }}>Notes</label>
                  <input value={djProfile.notes} onChange={e => updateDjProfile("notes", e.target.value)} placeholder="General notes about the DJ..." style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Summary pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { label: "Live DJ", val: "dj", color: "#004B23", bg: "#fff0f8", icon: "🎧" },
                { label: "Playlist", val: "playlist", color: "#0369a1", bg: "#f0f9ff", icon: "🎵" },
                { label: "No Music", val: "none", color: "#6b7280", bg: "#f3f4f6", icon: "🔇" },
                { label: "Undecided", val: null, color: "#9ca3af", bg: "#fafafa", icon: "·" },
              ].map(s => (
                <span key={String(s.val)} style={{ background: s.bg, color: s.color, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: "1px solid rgba(0,0,0,0.05)" }}>
                  {s.icon} {djCountByType(s.val)} {s.label}
                </span>
              ))}
            </div>

            {/* Per-event rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {djEvents.map((dj, idx) => {
                const isDJ = dj.musicNeeded === "dj";
                const isPL = dj.musicNeeded === "playlist";
                const isNone = dj.musicNeeded === "none";
                return (
                  <div key={idx} style={{ background: "#fff", borderRadius: 13, border: `1px solid ${isDJ ? "#f48cb8" : isPL ? "#bfdbfe" : isNone ? "#e5e7eb" : "#fce4f0"}`, overflow: "hidden", opacity: isNone ? 0.6 : 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 15px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#f06292", minWidth: 22, textAlign: "right" }}>{idx + 1}</span>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#003d1e" }}>{dj.event}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{dj.lead}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[
                          { val: "dj", label: "🎧 Live DJ", ac: "#E91E8C", ab: "#fff0f8" },
                          { val: "playlist", label: "🎵 Playlist", ac: "#0369a1", ab: "#f0f9ff" },
                          { val: "none", label: "🔇 None", ac: "#6b7280", ab: "#f3f4f6" },
                        ].map(opt => {
                          const active = dj.musicNeeded === opt.val;
                          return (
                            <button key={opt.val} onClick={() => updateDjEvent(idx, "musicNeeded", active ? null : opt.val)}
                              style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${active ? opt.ac : "#e5e7eb"}`, background: active ? opt.ab : "#fff", color: active ? opt.ac : "#9ca3af" }}>
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      {isDJ && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <input value={dj.setTime} onChange={e => updateDjEvent(idx, "setTime", e.target.value)} placeholder="Set time (e.g. 8:00 PM)" style={{ ...inputStyle, width: 150 }} />
                          <input value={dj.setDuration} onChange={e => updateDjEvent(idx, "setDuration", e.target.value)} placeholder="Duration (e.g. 3 hrs)" style={{ ...inputStyle, width: 140 }} />
                        </div>
                      )}
                    </div>
                    {isDJ && (
                      <div style={{ borderTop: "1px solid #fce4f0", padding: "10px 15px", background: "#fff8f9" }}>
                        <input value={dj.notes} onChange={e => updateDjEvent(idx, "notes", e.target.value)} placeholder="Special song requests, cues, or notes for this event..." style={inputStyle} />
                      </div>
                    )}
                    {isPL && (
                      <div style={{ borderTop: "1px solid #e0f2fe", padding: "13px 15px", background: "#f8fbff" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 9 }}>
                          {[
                            { label: "Playlist Owner / Manager", field: "playlistOwner", ph: "Who manages it?" },
                            { label: "Platform", field: "playlistPlatform", ph: "Spotify, Apple Music…" },
                            { label: "Playlist Link", field: "playlistLink", ph: "https://..." },
                            { label: "Notes / Vibe", field: "notes", ph: "Genre, mood, special songs…" },
                          ].map(f => (
                            <div key={f.field}>
                              <label style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", display: "block", marginBottom: 3 }}>{f.label}</label>
                              <input value={dj[f.field]} onChange={e => updateDjEvent(idx, f.field, e.target.value)} placeholder={f.ph} style={{ ...inputStyle, borderColor: "#bfdbfe" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LOGISTICS ── */}
        {tab === "Logistics" && (
          <div>
            <h2 style={{ margin: "0 0 18px", fontSize: 20, fontWeight: 700 }}>Logistics & Run of Show</h2>
            <div className="scroll-wrap" style={{ background: "#fff", borderRadius: 14, border: "1px solid #fce4f0", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                <thead><tr>{["Event / Committee", "Lead", "RoS Complete", "Rehearsal Needed", "Rehearsal Date", "AV Needs", "Room Setup ✓", "Notes"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {COMMITTEES.map((c, i) => {
                    const d = data[c.name];
                    return (
                      <tr key={c.name}>
                        <td style={{ ...tdStyle(i), fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                        <td style={{ ...tdStyle(i), fontSize: 11, color: "#6b7280" }}>{data[c.name].lead}</td>
                        <td style={tdStyle(i)}><Toggle checked={d.runOfShowComplete} onChange={v => updateCommittee(c.name, "runOfShowComplete", v)} /></td>
                        <td style={tdStyle(i)}><Toggle checked={d.rehearsalNeeded} onChange={v => updateCommittee(c.name, "rehearsalNeeded", v)} /></td>
                        <td style={tdStyle(i)}><input type="date" style={{ ...inputStyle, width: 130 }} /></td>
                        <td style={tdStyle(i)}><input placeholder="AV needs..." style={{ ...inputStyle, width: 120 }} /></td>
                        <td style={tdStyle(i)}><Toggle checked={d.roomSetupFinalized} onChange={v => updateCommittee(c.name, "roomSetupFinalized", v)} /></td>
                        <td style={tdStyle(i)}><input placeholder="Notes..." style={{ ...inputStyle, width: 150 }} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EVENT TIMELINE ── */}
        {tab === "Event Timeline" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Event Timeline</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Minute-by-minute run of show, organized by day. Add rows as the schedule evolves.</p>
              </div>
              <button onClick={addTimelineDay} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid #004B23", background: "#fff", color: "#004B23", cursor: "pointer", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>+ Add Day</button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {ACTIVITY_TYPES.map(t => {
                const c = ACTIVITY_COLORS[t];
                return <span key={t} style={{ background: c.bg, color: c.text, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{t}</span>;
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {timeline.map((dayBlock, dayIdx) => (
                <div key={dayIdx} style={{ background: "#fff", borderRadius: 14, border: "1px solid #fce4f0", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 17px", background: `linear-gradient(135deg, #E91E8C, #C2185B)` }}>
                    <input value={dayBlock.day} onChange={e => updateTimelineDayName(dayIdx, e.target.value)}
                      style={{ background: "transparent", border: "none", color: "#fff", fontWeight: 800, fontSize: 15, outline: "none", flex: 1, minWidth: 120 }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{dayBlock.entries.length} item{dayBlock.entries.length !== 1 ? "s" : ""}</span>
                      {addRowBtn(() => addTimelineEntry(dayIdx))}
                    </div>
                  </div>
                  <div className="scroll-wrap" style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
                      <thead>
                        <tr>{["#", "Event / Activity", "Type", "Start", "End", "Location", "Owner", "Notes", ""].map(h => (
                          <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", borderBottom: "1px solid #fce4f0", background: lightPink, whiteSpace: "nowrap" }}>{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody>
                        {dayBlock.entries.map((entry, entryIdx) => {
                          const ac = ACTIVITY_COLORS[entry.activityType] || ACTIVITY_COLORS["Event"];
                          return (
                            <tr key={entryIdx} style={{ background: entryIdx % 2 === 0 ? "#fff" : "#fff8f9", borderBottom: entryIdx < dayBlock.entries.length - 1 ? "1px solid #f0faf2" : "none" }}>
                              <td style={{ padding: "8px 10px", fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{entryIdx + 1}</td>
                              <td style={{ padding: "8px 10px" }}><input value={entry.event} onChange={e => updateTimelineEntry(dayIdx, entryIdx, "event", e.target.value)} placeholder="Event / activity name..." style={{ ...inputStyle, width: 220, fontWeight: 600 }} /></td>
                              <td style={{ padding: "8px 10px" }}>
                                <select value={entry.activityType} onChange={e => updateTimelineEntry(dayIdx, entryIdx, "activityType", e.target.value)}
                                  style={{ padding: "4px 8px", borderRadius: 20, border: `1.5px solid ${ac.text}`, background: ac.bg, color: ac.text, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                                  {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                              </td>
                              <td style={{ padding: "8px 10px" }}><input value={entry.startTime} onChange={e => updateTimelineEntry(dayIdx, entryIdx, "startTime", e.target.value)} placeholder="9:00 AM" style={{ ...inputStyle, width: 90 }} /></td>
                              <td style={{ padding: "8px 10px" }}><input value={entry.endTime} onChange={e => updateTimelineEntry(dayIdx, entryIdx, "endTime", e.target.value)} placeholder="10:00 AM" style={{ ...inputStyle, width: 90 }} /></td>
                              <td style={{ padding: "8px 10px" }}><input value={entry.location} onChange={e => updateTimelineEntry(dayIdx, entryIdx, "location", e.target.value)} placeholder="Location..." style={{ ...inputStyle, width: 130 }} /></td>
                              <td style={{ padding: "8px 10px" }}><input value={entry.owner} onChange={e => updateTimelineEntry(dayIdx, entryIdx, "owner", e.target.value)} placeholder="Owner..." style={{ ...inputStyle, width: 170 }} /></td>
                              <td style={{ padding: "8px 10px" }}><input value={entry.notes} onChange={e => updateTimelineEntry(dayIdx, entryIdx, "notes", e.target.value)} placeholder="Notes..." style={{ ...inputStyle, width: 220 }} /></td>
                              <td style={{ padding: "8px 10px" }}>{removeRowBtn(() => removeTimelineEntry(dayIdx, entryIdx))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SHIPPING & PROCUREMENT ── */}
        {tab === "Shipping & Procurement" && (
          <div>
            {sectionHeader("Shipping & Procurement", "Items each committee needs ordered and shipped to Vegas — committees should keep quotes with their artifacts. Track approval, ordering, and arrival here.")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COMMITTEES.map((c, ci) => {
                const rows = deliverables[c.name];
                const arrivedCount = rows.filter(r => r.arrived).length;
                return (
                  <div key={c.name} style={{ background: "#fff", borderRadius: 14, border: "1px solid #fce4f0", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", background: ci % 2 === 0 ? lightPink : "#f9fef9", borderBottom: "1px solid #fce4f0" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 10 }}>{data[c.name].lead}</span>
                        <span style={{ fontSize: 11, color: arrivedCount === rows.length && rows[0].deliverable ? "#15803d" : pink, marginLeft: 10, fontWeight: 600 }}>
                          {arrivedCount}/{rows.length} arrived
                        </span>
                      </div>
                      {addRowBtn(() => addDeliverable(c.name))}
                    </div>
                    <div className="scroll-wrap" style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                        <thead>
                          <tr>{["#", "Item", "Due Date", "Owner", "Approved", "Ordered", "Arrived", "Notes", ""].map(h => (
                            <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", borderBottom: "1px solid #fce4f0" }}>{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {rows.map((row, ri) => (
                            <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#fff8f9" }}>
                              <td style={{ padding: "7px 10px", fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{ri + 1}</td>
                              <td style={{ padding: "7px 10px" }}><input value={row.deliverable} onChange={e => updateDeliverable(c.name, ri, "deliverable", e.target.value)} placeholder="Item to order..." style={{ ...inputStyle, width: 180 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input type="date" value={row.dueDate} onChange={e => updateDeliverable(c.name, ri, "dueDate", e.target.value)} style={{ ...inputStyle, width: 130 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input value={row.owner} onChange={e => updateDeliverable(c.name, ri, "owner", e.target.value)} placeholder="Owner..." style={{ ...inputStyle, width: 110 }} /></td>
                              <td style={{ padding: "7px 10px", textAlign: "center" }}><input type="checkbox" checked={row.approved} onChange={e => updateDeliverable(c.name, ri, "approved", e.target.checked)} style={{ accentColor: "#E91E8C", width: 15, height: 15, cursor: "pointer" }} /></td>
                              <td style={{ padding: "7px 10px", textAlign: "center" }}><input type="checkbox" checked={row.ordered} onChange={e => updateDeliverable(c.name, ri, "ordered", e.target.checked)} style={{ accentColor: "#b45309", width: 15, height: 15, cursor: "pointer" }} /></td>
                              <td style={{ padding: "7px 10px", textAlign: "center" }}><input type="checkbox" checked={row.arrived} onChange={e => updateDeliverable(c.name, ri, "arrived", e.target.checked)} style={{ accentColor: "#15803d", width: 15, height: 15, cursor: "pointer" }} /></td>
                              <td style={{ padding: "7px 10px" }}><input value={row.notes} onChange={e => updateDeliverable(c.name, ri, "notes", e.target.value)} placeholder="Notes..." style={{ ...inputStyle, width: 140 }} /></td>
                              <td style={{ padding: "7px 10px" }}>{rows.length > 1 && removeRowBtn(() => removeDeliverable(c.name, ri))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RISK LOG ── */}
        {tab === "Risk Log" && (
          <div>
            {sectionHeader("Risk & Decision Log", "Each committee can log multiple risks, decisions needed, and outcomes.")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COMMITTEES.map((c, ci) => {
                const rows = risks[c.name];
                return (
                  <div key={c.name} style={{ background: "#fff", borderRadius: 14, border: "1px solid #fce4f0", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 15px", background: ci % 2 === 0 ? lightPink : "#f9fef9", borderBottom: "1px solid #fce4f0" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 10 }}>{data[c.name].lead}</span>
                        <span style={{ fontSize: 11, color: rows.filter(r => r.decision).length > 0 ? "#b45309" : "#9ca3af", marginLeft: 10, fontWeight: 600 }}>
                          {rows.filter(r => r.decision).length} item{rows.filter(r => r.decision).length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {addRowBtn(() => addRisk(c.name))}
                    </div>
                    <div className="scroll-wrap" style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                        <thead>
                          <tr>{["#", "Date", "Decision Needed", "Decision Made", "Approved By", "Notes", ""].map(h => (
                            <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", borderBottom: "1px solid #fce4f0" }}>{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {rows.map((row, ri) => (
                            <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#fff8f9" }}>
                              <td style={{ padding: "7px 10px", fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{ri + 1}</td>
                              <td style={{ padding: "7px 10px" }}><input type="date" value={row.date} onChange={e => updateRisk(c.name, ri, "date", e.target.value)} style={{ ...inputStyle, width: 130 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input value={row.decision} onChange={e => updateRisk(c.name, ri, "decision", e.target.value)} placeholder="Decision needed..." style={{ ...inputStyle, width: 175 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input value={row.decisionMade} onChange={e => updateRisk(c.name, ri, "decisionMade", e.target.value)} placeholder="Decision made..." style={{ ...inputStyle, width: 150 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input value={row.approvedBy} onChange={e => updateRisk(c.name, ri, "approvedBy", e.target.value)} placeholder="Approved by..." style={{ ...inputStyle, width: 120 }} /></td>
                              <td style={{ padding: "7px 10px" }}><input value={row.notes} onChange={e => updateRisk(c.name, ri, "notes", e.target.value)} placeholder="Notes..." style={{ ...inputStyle, width: 140 }} /></td>
                              <td style={{ padding: "7px 10px" }}>{rows.length > 1 && removeRowBtn(() => removeRisk(c.name, ri))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TRAVEL ── */}
        {tab === "Travel" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Travel Tracker</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>{travelers.length} travelers logged</p>
              </div>
              <button onClick={addTraveler} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid #004B23", background: "#fff", color: "#004B23", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>+ Add Traveler</button>
            </div>
            <div className="scroll-wrap" style={{ background: "#fff", borderRadius: 14, border: "1px solid #fce4f0", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                <thead>
                  <tr>{["#", "Soror Name", "Committee", "Arrival", "Departure", "Hotel", "Support Needed", "Notes", ""].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {travelers.map((t, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fff8f9", borderBottom: "1px solid #fce4f0" }}>
                      <td style={{ padding: "9px 13px", fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ padding: "9px 13px" }}><input value={t.name} onChange={e => updateTraveler(i, "name", e.target.value)} placeholder="Full name..." style={{ ...inputStyle, width: 150 }} /></td>
                      <td style={{ padding: "9px 13px" }}>
                        <select value={t.committee} onChange={e => updateTraveler(i, "committee", e.target.value)} style={{ ...inputStyle, width: 150 }}>
                          <option value="">— Select —</option>
                          {["MRD", "Chairman", "Tamiouchos", "Grammateus", "Technology", "Logistics", ...COMMITTEES.map(c => c.name)].map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "9px 13px" }}><input type="date" value={t.arrival} onChange={e => updateTraveler(i, "arrival", e.target.value)} style={{ ...inputStyle, width: 130 }} /></td>
                      <td style={{ padding: "9px 13px" }}><input type="date" value={t.departure} onChange={e => updateTraveler(i, "departure", e.target.value)} style={{ ...inputStyle, width: 130 }} /></td>
                      <td style={{ padding: "9px 13px" }}><input value={t.hotel} onChange={e => updateTraveler(i, "hotel", e.target.value)} placeholder="Hotel name..." style={{ ...inputStyle, width: 130 }} /></td>
                      <td style={{ padding: "9px 13px" }}><input value={t.support} onChange={e => updateTraveler(i, "support", e.target.value)} placeholder="Support needs..." style={{ ...inputStyle, width: 150 }} /></td>
                      <td style={{ padding: "9px 13px" }}><input value={t.notes} onChange={e => updateTraveler(i, "notes", e.target.value)} placeholder="Notes..." style={{ ...inputStyle, width: 140 }} /></td>
                      <td style={{ padding: "9px 13px" }}>{travelers.length > 1 && removeRowBtn(() => removeTraveler(i))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EXECUTIVE SUMMARY ── */}
        {tab === "📋 Executive Summary" && (
          <div>
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Executive Summary</h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
                  A live snapshot of everything currently entered across all tabs. Print it, copy it, or export the underlying data.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={printSummary} style={{ padding: "8px 16px", borderRadius: 20, border: "1px solid #004B23", background: "#fff", color: "#004B23", cursor: "pointer", fontWeight: 700, fontSize: 12.5 }}>🖨️ Print / Save as PDF</button>
                <button onClick={downloadJsonExport} style={{ padding: "8px 16px", borderRadius: 20, border: "1px solid " + pink, background: pink, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 12.5 }}>⬇ Download JSON</button>
                <button onClick={copyJsonToClipboard} style={{ padding: "8px 16px", borderRadius: 20, border: "1px solid #fce4f0", background: "#fff8f9", color: "#004B23", cursor: "pointer", fontWeight: 700, fontSize: 12.5 }}>
                  {copyConfirmation ? "✓ Copied!" : "Copy Data as JSON"}
                </button>
              </div>
            </div>

            {/* Report header (shows in print too) */}
            <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: "2px solid " + pink }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: pink, textTransform: "uppercase" }}>35th IRC · Operations Executive Summary</div>
              <h1 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800 }}>Conference Readiness Snapshot</h1>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#6b7280" }}>
                Generated {new Date().toLocaleString()} &nbsp;|&nbsp; International Regional Director: Carrie J. Clark
              </p>
            </div>

            {/* Top-level stats */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
              {summaryStatBox("Total Committees", totalCommittees, "#003d1e")}
              {summaryStatBox("Completed", completedCount, "#15803d", "#f0fdf4")}
              {summaryStatBox("In Progress", inProgressCount, "#b45309", "#fffbeb")}
              {summaryStatBox("At Risk", atRiskCount, "#ad1457", "#fff0f5")}
              {summaryStatBox("Not Started", notStartedCount, "#6b7280")}
              {summaryStatBox("On Track", onTrackCount, pink)}
            </div>

            <h2 style={{ fontSize: 15, fontWeight: 700, color: green, marginBottom: 8 }}>Budgets &amp; Procurement</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
              {summaryStatBox("Budgets Submitted", `${budgetCount}/${totalCommittees}`, pink)}
              {summaryStatBox("Quotes In", `${quotesCount}/${totalCommittees}`, "#0369a1")}
              {summaryStatBox("Signage Items Logged", totalSignageItems)}
              {summaryStatBox("Signage Installed", signageInstalled, "#15803d")}
              {summaryStatBox("Shipping Items Logged", totalDeliverables)}
              {summaryStatBox("Shipping Arrived", deliverablesArrived, "#15803d")}
            </div>

            <h2 style={{ fontSize: 15, fontWeight: 700, color: green, marginBottom: 8 }}>People &amp; Schedule</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
              {summaryStatBox("Members Logged", totalMembers)}
              {summaryStatBox("Travelers Logged", travelers.filter(t => t.name.trim()).length)}
              {summaryStatBox("Timeline Entries", totalTimelineEntries)}
              {summaryStatBox("Timeline Days", timeline.length)}
              {summaryStatBox("Open Risk Items", totalRiskEntries, totalRiskEntries > 0 ? "#ad1457" : "#003d1e")}
            </div>

            <h2 style={{ fontSize: 15, fontWeight: 700, color: green, marginBottom: 8 }}>DJ &amp; Music Coverage</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
              {summaryStatBox("Live DJ Assigned", djAssignedCount, pink)}
              {summaryStatBox("Playlist Assigned", playlistAssignedCount, "#0369a1")}
              {summaryStatBox("No Music", noMusicCount, "#6b7280")}
              {summaryStatBox("Undecided", musicUndecidedCount, musicUndecidedCount > 0 ? "#b45309" : "#003d1e")}
            </div>

            {/* Committees at risk */}
            <h2 style={{ fontSize: 15, fontWeight: 700, color: green, marginBottom: 8 }}>Committees Flagged "At Risk"</h2>
            {committeesAtRisk.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 20 }}>No committees are currently flagged at risk.</p>
            ) : (
              <div style={{ background: "#fff0f5", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 16px", marginBottom: 20 }}>
                {committeesAtRisk.map(c => (
                  <div key={c.name} style={{ fontSize: 12.5, padding: "4px 0", color: "#ad1457" }}>
                    <b>{c.name}</b> — {data[c.name].lead}
                  </div>
                ))}
              </div>
            )}

            {/* Open risk/issue notes */}
            <h2 style={{ fontSize: 15, fontWeight: 700, color: green, marginBottom: 8 }}>Noted Risks &amp; Issues (Dashboard tab)</h2>
            {committeesWithNotedRisks.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 20 }}>No risk notes have been entered on the Dashboard tab yet.</p>
            ) : (
              <div style={{ background: "#fff8f9", border: "1px solid #fce4f0", borderRadius: 12, padding: "10px 16px", marginBottom: 20 }}>
                {committeesWithNotedRisks.map(c => (
                  <div key={c.name} style={{ fontSize: 12.5, padding: "4px 0" }}>
                    <b>{c.name}:</b> {data[c.name].risks}
                  </div>
                ))}
              </div>
            )}

            {/* Committees missing budget */}
            <h2 style={{ fontSize: 15, fontWeight: 700, color: green, marginBottom: 8 }}>Committees Without a Submitted Budget</h2>
            {committeesMissingBudget.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 20 }}>All committees have submitted a budget.</p>
            ) : (
              <div style={{ border: "1px solid #fce4f0", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Committee", "Lead", "Status"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>
                    {committeesMissingBudget.map((c, i) => (
                      <tr key={c.name}>
                        <td style={{ ...tdStyle(i), fontWeight: 600, fontSize: 12.5 }}>{c.name}</td>
                        <td style={{ ...tdStyle(i), fontSize: 11.5, color: "#6b7280" }}>{data[c.name].lead}</td>
                        <td style={tdStyle(i)}><StatusBadge status={data[c.name].status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Full committee table */}
            <h2 style={{ fontSize: 15, fontWeight: 700, color: green, marginBottom: 8 }}>Full Committee Status</h2>
            <div className="scroll-wrap" style={{ border: "1px solid #fce4f0", borderRadius: 12, overflow: "auto", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Committee", "Lead", "Status", "Budget", "Quotes", "On Track", "Members", "Signage", "Shipping"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                <tbody>
                  {COMMITTEES.map((c, i) => {
                    const d = data[c.name];
                    return (
                      <tr key={c.name}>
                        <td style={{ ...tdStyle(i), fontWeight: 600, fontSize: 12 }}>{c.name}</td>
                        <td style={{ ...tdStyle(i), fontSize: 11, color: "#6b7280" }}>{data[c.name].lead}</td>
                        <td style={tdStyle(i)}><StatusBadge status={d.status} /></td>
                        <td style={{ ...tdStyle(i), fontSize: 12 }}>{d.budgetSubmitted ? "✓" : "—"}</td>
                        <td style={{ ...tdStyle(i), fontSize: 12 }}>{d.quotesSubmitted ? "✓" : "—"}</td>
                        <td style={{ ...tdStyle(i), fontSize: 12 }}>{d.onTrack ? "✓" : "—"}</td>
                        <td style={{ ...tdStyle(i), fontSize: 12 }}>{members[c.name].filter(m => m.name.trim()).length}</td>
                        <td style={{ ...tdStyle(i), fontSize: 12 }}>{signageRows[c.name].filter(r => r.item.trim()).length}</td>
                        <td style={{ ...tdStyle(i), fontSize: 12 }}>{deliverables[c.name].filter(r => r.deliverable.trim()).length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="no-print" style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 6 }}>
              Tip: use "Print / Save as PDF" for a polished leave-behind document, or "Download JSON" to hand the full underlying
              data to a teammate (or to Claude) for a more detailed written report.
            </p>
          </div>
        )}

        {/* ── AI ASSISTANT ── */}
        {tab === "✨ AI Assistant" && (
          <div style={{ maxWidth: 740, margin: "0 auto" }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #fce4f0", overflow: "hidden", boxShadow: "0 4px 24px rgba(200,16,46,0.08)" }}>
              <div style={{ padding: "15px 18px", borderBottom: "1px solid #fce4f0", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, #E91E8C, #C2185B)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✨</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>IRC Operations AI</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>Aware of all {totalCommittees} committees & current status</div>
                </div>
              </div>
              <div style={{ height: 420, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: 12 }}>
                {aiMessages.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "82%", padding: "11px 15px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? `linear-gradient(135deg, #E91E8C, #C2185B)` : "#fff0f8", color: m.role === "user" ? "#fff" : "#003d1e", fontSize: 13, lineHeight: 1.6 }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ display: "flex", gap: 5, padding: "11px 15px", background: "#fff0f8", borderRadius: "18px 18px 18px 4px", width: "fit-content" }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: pink, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                  </div>
                )}
              </div>
              <div style={{ padding: "12px 15px", borderTop: "1px solid #fce4f0", display: "flex", gap: 8 }}>
                <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAiMessage()}
                  placeholder="Ask about status, risks, next steps, draft communications..."
                  style={{ flex: 1, padding: "9px 13px", borderRadius: 12, border: "1px solid #fce4f0", fontSize: 13, color: "#003d1e", outline: "none" }} />
                <button onClick={sendAiMessage} disabled={aiLoading || !aiInput.trim()}
                  style={{ padding: "9px 18px", borderRadius: 12, background: aiLoading || !aiInput.trim() ? "#e5e7eb" : `linear-gradient(135deg, #E91E8C, #C2185B)`, color: "#fff", border: "none", cursor: aiLoading || !aiInput.trim() ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 13 }}>
                  Send
                </button>
              </div>
              <div style={{ padding: "6px 15px 13px", display: "flex", gap: 7, flexWrap: "wrap" }}>
                {["What committees are at risk?", "Summarize overall status", "What needs budget submission?", "Draft a steering committee update"].map(q => (
                  <button key={q} onClick={() => setAiInput(q)} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, border: "1px solid #fce4f0", background: "#fff8f9", color: "#004B23", cursor: "pointer", fontWeight: 500 }}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
      <style>{`
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        input:focus, select:focus { outline: 2px solid #E91E8C; outline-offset: 1px; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #fff0f8; }
        ::-webkit-scrollbar-thumb { background: #f06292; border-radius: 3px; }

        /* ── MOBILE RESPONSIVENESS ──────────────────────────────────── */
        /* Smooth, native-feeling scrolling on iOS for every scrollable area */
        .scroll-wrap, .tab-row { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }

        /* Bigger, easier-to-tap toggle switches and checkboxes on touch screens,
           using padding to grow the tap target without changing the visual size. */
        @media (pointer: coarse) {
          input[type="checkbox"] { width: 20px !important; height: 20px !important; }
          .toggle-tap-area { padding: 11px; margin: -11px; }
        }

        @media (max-width: 720px) {
          .app-header { padding: 18px 14px 0 !important; }
          .header-title { font-size: 20px !important; }
          .header-top-row { gap: 14px !important; }

          /* Stack the director card and stat pills under the title instead of
             pinning them to the right, which gets cramped on a narrow screen. */
          .header-right-col { align-items: flex-start !important; width: 100%; }
          .director-card { width: 100%; box-sizing: border-box; }
          .stat-pill-row { width: 100%; justify-content: flex-start !important; }
          .stat-pill { flex: 1 1 calc(50% - 5px); min-width: 0 !important; padding: 8px 10px !important; }

          .tab-button { padding: 9px 11px !important; font-size: 11.5px !important; }

          .main-content { padding: 14px 12px !important; }

          /* Give every horizontally-scrolling table a soft right-edge shadow as a
             visual cue that there's more content to scroll to, since phones don't
             show a visible scrollbar by default the way desktop browsers do. */
          .scroll-wrap {
            position: relative;
            background-image: linear-gradient(to right, transparent, transparent),
              linear-gradient(to right, rgba(0,0,0,0.06), transparent 12px);
            background-position: 0 0, 100% 0;
            background-repeat: no-repeat;
            background-size: 100% 100%, 14px 100%;
            background-attachment: local, scroll;
          }
        }

        @media (max-width: 480px) {
          .header-title { font-size: 18px !important; }
          .stat-pill { flex: 1 1 100%; }
        }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>
    </div>
  );
}

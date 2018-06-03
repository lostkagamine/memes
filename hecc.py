# HECC
# hi thanks kappy

def ask_exit():
    qc = input('Would you like to quit? (y/n): ')
    if qc in ['y', 'yes']:
        print('Quitting...')
        exit()
    else:
        main()

def main():
    try:
        wh = int(input('Total working hours: '))
    except TypeError:
        print('Unable to convert into a number.')
        ask_exit()
    try:
        hr = int(input('Hourly rate: '))
    except TypeError:
        print('Unable to convert into a number.')
        ask_exit()
    print(f'Pay: {wh*hr}')
    ask_exit()

main()
